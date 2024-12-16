
class TableFooterRenderer {

    /**
     * @type { TablePanel }
     */
    parent

    /** @type { HTMLElement } */
    #container

    /** @type { HTMLElement } */
    #footer

    constructor(parent) {
        this.parent = parent

        this.#container = document.createElement("div")
        this.#container.classList.add('split-table-footer')

        const table = document.createElement("table")
        table.classList.add(classes.splitTable)
        table.classList.add(...parent.model.css)

        this.#footer = document.createElement("tfoot")

        table.append(this.#footer)

        this.#container.append(table)
    }

    render() {
        this.parent.rootElement.append(this.#container)
    }

    #renderRow() {
        const tr = document.createElement('tr')


        return tr
    }

    /**
     * @param { ColumnModel } column
     */
    #createFooterCell(column) {
        const td = document.createElement('td')

        return td
    }

    destroy() {
        this.#container.remove()
    }

}
