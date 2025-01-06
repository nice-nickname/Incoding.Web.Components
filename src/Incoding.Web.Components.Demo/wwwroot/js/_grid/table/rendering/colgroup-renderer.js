
class ColgroupRenderer {

    /**
     * @type { SplitTable }
     */
    parent

    constructor(parent) {
        this.parent = parent;
    }

    render() {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            this.renderPanel(i)
        }
    }

    renderPanel(index) {
        const headerTable = this.parent.headerRenderer.tables[index],
            bodyTable = this.parent.contentRenderer.tables[index],
            footerTable = this.parent.footerRenderer.tables[index];

        const colgroup = this.#createColgroup(index)

        headerTable.append(colgroup)
        bodyTable.append(colgroup.cloneNode(true))
        footerTable.append(colgroup.cloneNode(true))
    }

    #createColgroup(panelIndex) {
        const columns = this.parent.schemaModel[panelIndex].getFlatColumns();

        const colgroup = document.createElement('colgroup')
        for (const column of columns) {
            const col = document.createElement('col')
            col.dataset.uid = column.uid
            col.style.width = column.width + 'px'

            colgroup.append(col)
        }

        return colgroup
    }

    updateColumn(panelIndex, column) {
        const tables = [
            this.parent.headerRenderer.tables[panelIndex],
            this.parent.contentRenderer.tables[panelIndex],
            this.parent.footerRenderer.tables[panelIndex]
        ]

        tables.forEach(table => {
            const colgroup = table.querySelector('colgroup')

            const col = colgroup.querySelector(`col[data-uid="${column.uid}"]`)

            col.style.width = column.width + 'px'
        })
    }


    refresh() {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            const headerTable = this.parent.headerRenderer.tables[i],
                bodyTable = this.parent.contentRenderer.tables[i],
                footerTable = this.parent.footerRenderer.tables[i];

            const colgroup = this.#createColgroup(i)

            headerTable.lastChild.replaceWith(colgroup)
            bodyTable.lastChild.replaceWith(colgroup.cloneNode(true))
            footerTable.lastChild.replaceWith(colgroup.cloneNode(true))
        }
    }
}
