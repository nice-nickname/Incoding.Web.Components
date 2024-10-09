
class RowDropdown {

    /**
     * @type { SplitTable }
     */
    table

    #dropdownTmpl

    /**
     * @type { object }
     */
    #targetRowData

    constructor(table) {
        this.table = table

        this.#dropdownTmpl = ExecutableInsert.Template.compile(table.row.dropdownTmpl)

        this.#addEventListeners()
    }

    show(top, left) {
        const rowData = this.#targetRowData

        const template = document.createElement('template')
        template.innerHTML = ExecutableInsert.Template.render(this.#dropdownTmpl, rowData)

        const dropdown = template.content.children.item(0)
        IncodingEngine.Current.parse(dropdown)

        const menu = Menu.fromElement(dropdown, {
            onClose: () => { this.#targetRowData = null }
        })

        menu.show(top, left)
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
        const coords = target.getBoundingClientRect()

        if (target.role === 'dropdown') {
            const row = target.closest('tr')
            const rowIndex = row.dataset.index

            const data = this.table.getData()

            this.#targetRowData = data[rowIndex]

            this.show(coords.bottom, coords.left)
        }
    }
}
