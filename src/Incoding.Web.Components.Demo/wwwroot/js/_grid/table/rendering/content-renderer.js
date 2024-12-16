
class TableContentRenderer {

    /**
     * @type { TablePanel }
     */
    parent


    /** @type { HTMLElement } */
    #container

    /** @type { HTMLElement } */
    #body

    constructor(parent) {
        this.parent = parent;

        this.#container = document.createElement("div")
        this.#container.classList.add('split-table-content')

        const table = document.createElement("table")
        table.id = parent.model.id
        table.classList.add(classes.splitTable)
        table.classList.add(...parent.model.css)

        this.#body = document.createElement('tbody')
        table.append(this.#body)

        this.#container.append(table)
    }

    render() {
        this.parent.rootElement.append(this.#container)
    }

    destroy() {
        this.#container.remove()
    }
}
