
class TableHeaderRenderer extends TablePanelRendererBase {

    /**
     * @type { HTMLElement[] }
     */
    theads

    constructor(parent) {
        super(parent);
        this.theads = []
    }

    /**
     * @param { HTMLElement[] } panelsContainers
     */
    renderPanels(panelsContainers) {
        super.renderPanels(panelsContainers, 'split-table-header', 'thead', 'theads')
    }

    render() {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            this.refreshPanel(i)
        }
    }

    refreshPanel(index) {
        const panelModel = this.parent.schemaModel[index]
        const thead = this.theads[index]

        const cells = this.#createCells([], panelModel.columns)

        const trs = cells.map((row, i) => {
            const tr = document.createElement('tr')

            row.forEach((cell) => {
                tr.append(cell.element)
            })

            if (i === 0) {
                tr.append(HeaderCellComponent.dummy())
            }

            return tr
        })

        thead.replaceChildren(...trs)
    }

    /**
     * @param { HeaderCellComponent[][] } cells
     * @param { ColumnModel[] } columns
     * @param { number } level
     */
    #createCells(cells, columns, level = 0) {
        if (!cells[level]) {
            cells[level] = []
            cells[level].pinOffset = 0
        }

        columns.forEach(column => {
            const cell = new HeaderCellComponent(column)

            cells[level].push(cell)

            if (column.isPinned) {
                cell.element.classList.add('column-pinned')
                cell.element.style.left = cells[level].pinOffset + 'px'
                cells[level].pinOffset += column.width
            }

            if (column.isStacked()) {
                this.#createCells(cells, column.stacked, level + 1)
            }
        })

        return cells
    }

    destroy() {
        for (const thead of this.theads) {
            thead.innerHTML = ''
        }
    }

}
