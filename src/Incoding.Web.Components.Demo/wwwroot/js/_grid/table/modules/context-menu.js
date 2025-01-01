
class ContextMenu {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { Menu | null }
     */
    #menu = null

    /**
     * @type { {
     *     rowIndex: number,
     *     rowData: Object,
     *     column: ColumnModel
     *  } | null }
     */
    #targetData

    constructor(splitTable) {
        this.splitTable = splitTable

        this.splitTable.addManagedEventListener("body", "contextmenu", this.#handleContextMenu)
    }

    destroy() {
        this.#menu?.destroy()
        this.#menu = null
        this.#targetData = null
    }

    /**
     * @param { PointerEvent } ev
     * @param { TablePanelModel } panelModel
     */
    #handleContextMenu = (ev, panelModel) => {
        const { target, clientX, clientY } = ev

        const td = target.closest('td')
        const tr = target.closest('tr')

        if (td.classList.contains(classes.nestedTableContainer)) {
            return
        }

        ev.preventDefault()
        ev.stopPropagation()

        const column = panelModel.getColumn(td.dataset.uid)
        const rowIndex = Number(tr.dataset.rowIndex)
        const rowData = this.splitTable.dataSource.getData()[rowIndex]

        this.#targetData = {
            column, rowIndex, rowData
        }

        if (this.#menu) {
            this.#menu.hide()
        }

        this.#menu = this.#createMenu()
        this.#menu.show(clientY, clientX)
    }

    #createMenu() {
        return new Menu({
            items: this.#getMenuItems(),
            onClick: this.#onMenuItemClick,
            onClose: this.#onClose
        })
    }

    #getMenuItems() {
        const { column } = this.#targetData

        const items = [
            { icon: 'ci-copy', text: 'Copy', action: 'Copy' },
            { icon: 'ci-copy', text: 'Copy with heading', action: 'CopyWithHeading' },
        ]

        if (column && column.sortable) {
            items.push(
                { isDivider: true },
                { icon: 'ci-caret-down', text: 'Sort Asc', action: 'SortAsc' },
                { icon: 'ci-caret-up', text: 'Sort Desc', action: 'SortDesc' }
            )
        }

        return items
    }

    /**
     * @param { string | null } action
     */
    #onMenuItemClick = (action) => {
        const splitTable = this.splitTable
        const clipboard = new ClipboardService(this.splitTable)

        const { rowData, column } = this.#targetData

        switch (action) {
            case 'Copy':
                clipboard.copyRow(rowData)
                break;

            case 'CopyWithHeading':
                clipboard.copyRow(rowData, true)
                break;

            case 'SortAsc':
                splitTable.sort.sortColumn(column, SortOrder.Asc)
                break;

            case 'SortDesc':
                splitTable.sort.sortColumn(column, SortOrder.Desc)
                break;

            default:
                break;
        }
    }

    #onClose = () => {
        this.#menu = null
    }
}
