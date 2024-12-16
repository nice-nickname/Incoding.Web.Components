
class SplitTablePanel {

    /**
     *  @type { SplitTable }
     */
    splitTable

    /**
     * @type { TablePanelModel }
     */
    model


    /**  @type { HTMLElement } */
    rootElement


    /** @type { TableHeaderRenderer } */
    #header

    /** @type { TableContentRenderer } */
    #content

    /** @type { TableFooterRenderer } */
    #footer

    constructor(splitTable, panelModel) {
        this.splitTable = splitTable;
        this.model = panelModel

        this.rootElement = document.createElement('div')
        this.rootElement.classList.add('split-table-container')

        this.#header = new TableHeaderRenderer(this)
        this.#content = new TableContentRenderer(this)
        this.#footer = new TableFooterRenderer(this)
    }

    render() {
        this.#header.render()
        this.#content.render()
        this.#footer.render()
    }

    getColumns() {
        return this.model.columns
    }

    getFlatColumns() {
        const columns = []

        for (const column of this.model.columns) {
            if (column.stacked.length !== 0) {
                columns.push(...column.stacked)
            } else {
                columns.push(column)
            }
        }

        return columns
    }

    getRootElement() {
        return this.rootElement
    }


    destroy() {
        this.#header.destroy()
        this.#content.destroy()
        this.#footer.destroy()
    }
}
