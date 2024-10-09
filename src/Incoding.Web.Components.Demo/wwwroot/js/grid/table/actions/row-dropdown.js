
class RowDropdown {

    /**
     * @type { SplitTable }
     */
    table

    #dropdownTmpl

    constructor(table) {
        this.table = table

        this.#dropdownTmpl = ExecutableInsert.Template.compile(table.row.dropdownTmpl)

        this.#addEventListeners()
    }

    show(rowIndex, top, left) {
        const rowData = this.table.dataBinding.getData()[rowIndex]

        const template = document.createElement('template')
        template.innerHTML = ExecutableInsert.Template.render(this.#dropdownTmpl, rowData)

        const dropdown = template.content.children.item(0)
        IncodingEngine.Current.parse(dropdown)

        const menu = Menu.fromElement(dropdown, {
            onClose: (menu) => menu.destroy()
        })

        menu.show(top, left)
    }

    destroy() {
        this.#removeEventListeners()
    }

    #addEventListeners() {
        this.table.tbody.addEventListener('click', this.#handleOpenMenu)
    }

    #removeEventListeners() {
        this.table.tbody.removeEventListener('click', this.#handleOpenMenu)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleOpenMenu = (ev) => {
        const target = ev.target

        if (target.role !== 'dropdown') {
            return
        }

        const tr = $(ev.target).closest('tr')[0]
        const coordinates = target.getBoundingClientRect()

        this.show(Number(tr.dataset.index),
            coordinates.bottom,
            coordinates.left
        )
    }
}
