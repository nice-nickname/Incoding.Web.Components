
class RowDropdown {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { Menu | null }
     */
    #menu = null

    /**
     * @type { number | null }
     */
    #rowIndex = null


    constructor(splitTable) {
        this.splitTable = splitTable

        this.splitTable.addManagedEventListener("body", "click", this.#handleClick)
    }

    destroy() {
        this.#menu.hide()
        this.#menu?.destroy()
    }

    /**
     * @param { PointerEvent } ev
     * @param { TablePanelModel } panelModel
     */
    #handleClick = (ev, panelModel) => {
        const target = ev.target

        if (target.role === roles.rowDropdown) {
            ev.stopPropagation()

            const tr = target.closest("tr")

            const rowIndex = Number(tr.dataset.rowIndex)
            const prevRowIndex = this.#rowIndex

            const rowData = this.splitTable.dataSource.getData()[rowIndex]

            if (this.#menu) {
                const wasOpened = this.#menu.isOpen()

                this.#menu.hide()
                this.#menu.destroy()
                this.#menu = null

                if (wasOpened && rowIndex === prevRowIndex) {
                    return
                }
            }

            const { left, bottom } = target.getBoundingClientRect()
            this.#menu = this.#createMenu(panelModel.row.dropdownTmpl, rowData)
            this.#menu.show(bottom, left)
        }
    }

    #createMenu(dropdownTmpl, rowData) {
        const template = document.createElement('template')
        template.innerHTML = ExecutableInsert.Template.render(dropdownTmpl, rowData)

        const dropdown = template.content.children.item(0)
        IncodingEngine.Current.parse(dropdown)

        return Menu.fromElement(dropdown, {
            keepOnClose: true
        })
    }

}
