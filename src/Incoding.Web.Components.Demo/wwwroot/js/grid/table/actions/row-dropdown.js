
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

        const menu = Menu.fromElement(dropdown, { })

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
        const tr = target.closest('tr')

        if (!tr) {
            return
        }

        if (target.role === 'dropdown') {
            this.#openDropdown(target, tr)
        }

        if (target.role === 'expand') {
            this.#openExpand(target, tr)
        }
    }

    #openDropdown(target, tr) {
        const coordinates = target.getBoundingClientRect()

        this.show(Number(tr.dataset.index),
            coordinates.bottom,
            coordinates.left
        )
    }

    #openExpand(target, tr) {
        const rowIndex = Number(tr.dataset.index)

        this.table.dataBinding.renderNested(rowIndex)
    }
}
