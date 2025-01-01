
class TableContentRenderer extends TablePanelRendererBase {

    /**
     * @type { HTMLTableSectionElement[] }
     */
    tbodies

    /**
     * @type { HTMLElement[] }
     */
    placeholders

    #rowIndex = 0

    constructor(parent) {
        super(parent)
        this.tbodies = []
        this.placeholders = []
    }

    /**
     * @param { HTMLElement[] } panelsContainers
     */
    renderPanels(panelsContainers) {
        super.renderPanels(panelsContainers, 'split-table-content', 'tbody', 'tbodies')

        this.elements.forEach(element => {
            const placeholder = document.createElement('div')
            placeholder.classList.add('rows-placeholder')
            placeholder.innerHTML = `<span>No rows to display</span>`

            this.placeholders.push(placeholder)
            element.append(placeholder)
        })
    }

    renderRows(data) {
        this.hideNoRows()
        this.hideLoadingRows()

        const rowRenderer = new RowRenderer(this.parent)

        for (const rowData of data) {
            for (let i = 0; i < this.tbodies.length; i++) {
                const panelModel = this.parent.schemaModel[i]
                const tbody = this.tbodies[i]

                const tr = rowRenderer.render(panelModel, this.#rowIndex)
                tbody.append(tr)
            }

            this.#rowIndex++
        }
    }

    destroy() {
        this.removeRows()
    }

    removeRows() {
        for (const tbody of this.tbodies) {
            tbody.innerHTML = ''
        }
        this.#rowIndex = 0
    }


    showNoRows() {
        for (let i = 0; i < this.elements.length; i++) {
            this.tables[i].classList.add(classes.hidden)
            this.placeholders[i].classList.remove(classes.hidden)
        }
    }

    hideNoRows() {
        for (let i = 0; i < this.elements.length; i++) {
            this.tables[i].classList.remove(classes.hidden)
            this.placeholders[i].classList.add(classes.hidden)
        }
    }


    showLoadingRows() {
        const rowRenderer = new RowRenderer(this.parent)

        for (let i = 0; i < this.tbodies.length; i++) {
            const panelModel = this.parent.schemaModel[i]
            const tbody = this.tbodies[i]

            const trs = Array.from({ length: 3 }, () => rowRenderer.renderLoadingRow(panelModel))
            tbody.append(...trs)
        }
    }

    hideLoadingRows() {
        for (const tbody of this.tbodies) {
            tbody.querySelectorAll(`[role=${roles.temp}]`)
                .forEach((tempTr) => tempTr.remove())
        }
    }

}
