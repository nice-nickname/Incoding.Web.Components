
class TablePanelEditor {

    /**
     * @type { TablePanelModel }
     */
    panelModel

    constructor(panelModel) {
        this.panelModel = panelModel
    }

    rename(uid, title) {
        const column = this.panelModel.getColumn(uid);
        column.title = title
    }

    remove(uid) {
        const column = this.panelModel.getColumn(uid);

        if (column.hasStackedParent()) {
            const parent = this.panelModel.getColumn(column.parentUid)
            parent.stacked.remove(column)
        } else {
            this.panelModel.columns.remove(column)
        }

        this.#updateIndexes()
    }

    resize(uid, width) {
        const column = this.panelModel.getColumn(uid);
        column.width = Math.min(
            Math.max(width, column.width),
            ColumnModel.MAX_WIDTH
        );
    }

    moveColumn(uid, position) {
        const targetColumn = this.panelModel.getColumn(uid);

        if (position === 0) {
            position = this.#getFirstPositionAfterPinned()
        }

        const columns = this.panelModel.columns.remove(targetColumn);
        columns.splice(position, 0, targetColumn);

        this.panelModel.columns = columns;

        this.#updateIndexes()
    }

    pin(uid) {
        const column = this.panelModel.getColumn(uid);
        const pinnedPosition = this.#getFirstPositionAfterPinned()

        for (const controlColumn of this.panelModel.getControlColumns()) {
            controlColumn.setPin(true)
        }

        column.setPin(true)

        this.moveColumn(uid, pinnedPosition)
    }

    unpin(uid) {
        const column = this.panelModel.getColumn(uid);
        const unpinPosition = this.#getActualIndex(column.index) - 1

        column.setPin(false)

        if (this.#shouldUnpinControlColumns()) {
            for (const controlColumn of this.panelModel.getControlColumns()) {
                controlColumn.setPin(false)
            }
        }

        this.moveColumn(uid, unpinPosition)
    }

    /**
     * @param { ColumnModel[] } columns
     * @param { number } startIndex
     */
    #updateIndexes(columns = undefined, startIndex = 0) {
        columns = columns || this.panelModel.columns;

        const pinned = columns
            .filter(column => column.isPinned)
            .map(column => column.index)

        let index = startIndex;

        for (const column of columns) {
            if (column.isPinned || column.isControlColumn()) {
                continue;
            }

            while (pinned.includes(index))
                index++

            column.index = index

            if (column.isStacked()) {
                this.#updateIndexes(column.stacked, index)
                index += column.stacked.length
            } else {
                index += 1
            }
        }
    }

    #getFirstPositionAfterPinned() {
        let index = 0

        for (const column of this.panelModel.columns) {
            if (!column.isPinned && !column.isControlColumn()) {
                break
            }

            index++;
        }

        return index;
    }

    #getActualIndex(index) {
        const columns = this.panelModel.columns

        for (let pos = 0; pos < columns.length; pos++) {
            const column = columns[pos];

            if (column.isPinned || column.isControlColumn()) {
                continue
            }

            if (column.index >= index) {
                return pos
            }
        }

        return columns.length - 1
    }

    #shouldUnpinControlColumns() {
        const pinned = this.panelModel.columns
            .filter(column => column.isPinned)

        let regularPinned = 0
        let controlsPinned = 0
        for (const column of pinned) {
            column.isControlColumn()
                ? controlsPinned++
                : regularPinned++
        }

        return regularPinned === 0 && controlsPinned !== 0
    }

}
