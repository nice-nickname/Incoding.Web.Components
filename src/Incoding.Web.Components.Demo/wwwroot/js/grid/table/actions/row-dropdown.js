
class RowDropdown {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { Menu }
     */
    #menu

    #dropdownTmpl

    /**
     * @type { object }
     */
    #rowData

    constructor(table) {
        this.table = table

        this.#menu = null
        this.#dropdownTmpl = ExecutableInsert.Template.compile(table.row.dropdownTmpl)

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()
    }

    #addEventListeners() {
        this.table.tbody.addEventListener('click', this.#handleClick)
    }

    #removeEventListeners() {
        this.table.tbody.removeEventListener('click', this.#handleClick)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        const target = ev.target

        if (target.role === roles.dropdown) {
            ev.stopPropagation()

            const prevRowData = this.#rowData
            const rowData = this.#getRowDataFromTarget(target)

            if (this.#menu) {
                this.#menu.hide()
                this.#menu = null

                if (prevRowData === rowData) {
                    return
                }
            }

            const { bottom, left } = target.getBoundingClientRect()

            this.#menu = this.#createMenu(rowData)
            this.#menu.show(bottom, left)
            this.#rowData = rowData
        }
    }

    #createMenu(data) {
        const template = document.createElement('template')
        template.innerHTML = ExecutableInsert.Template.render(this.#dropdownTmpl, data)

        const dropdown = template.content.children.item(0)
        IncodingEngine.Current.parse(dropdown)

        return Menu.fromElement(dropdown, { })
    }

    #getRowDataFromTarget(target) {
        const row = target.closest('tr')
        const rowIndex = row.dataset.index
        const data = this.table.getData().at(rowIndex)

        return data
    }
}
