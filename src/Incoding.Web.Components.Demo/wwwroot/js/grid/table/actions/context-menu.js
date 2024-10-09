
class ContextMenu {

    /**
     * @type { SplitTable }
     */
    #table

    /**
     * @type { Menu | null }
     */
    #menu = null

    /**
     * @type { {
     *  column: Column,
     *  rowIndex: number,
     *  rowData: object
     * } }
     */
    target

    constructor(table) {
        this.#table = table

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()

        this.#menu?.destroy()
    }

    #addEventListeners() {
        this.#table.tbody.addEventListener('contextmenu', this.#handleContextMenu)
    }

    #removeEventListeners() {
        this.#table.tbody.removeEventListener('contextmenu', this.#handleContextMenu)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleContextMenu = (ev) => {
        const { target, clientX, clientY } = ev

        const cell = target.closest('td')
        const targetColumn = this.#table.getColumn(cell.dataset.uid)

        if (targetColumn == null || !targetColumn.showMenu) {
            return
        }

        const row = target.closest('tr')
        const data = this.#table.getData()
        const rowIndex = Number(row.dataset.index)

        ev.preventDefault()
        ev.stopPropagation()

        this.target = {
            column: targetColumn,
            rowIndex: rowIndex,
            rowData: data[rowIndex]
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
            onClose: () => this.#menu = null,
            onClick: this.#onMenuClick
        })
    }

    /**
     * @returns { MenuItem[] }
     */
    #getMenuItems() {
        const { column } = this.target

        /**
         * @type { MenuItem[] }
         */
        const items = [
            { icon: '', text: 'Copy', action: 'Copy' },
            { icon: '', text: 'Copy with heading', action: 'CopyWithHeading' },
            { isDivider: true }
        ]

        if (column.resizable) {
            items.push({ icon: '', text: 'Auto fit', action: 'AutoFit' })
        }

        if (column.sortable) {
            items.push(
                { icon: '', text: 'Sort Asc', action: 'SortAsc' },
                { icon: '', text: 'Sort Desc', action: 'SortDesc' }
            )
        }

        if (items.length === 3) {
            items.pop()
        }

        return items
    }

    /**
     * @param { string | null } action
     */
    #onMenuClick = (action) => {
        const table = this.#table
        const clipboard = new ClipboardService(this.#table)

        switch (action) {
            case 'Copy':
                clipboard.copyRow(this.target.rowData)
                break;

            case 'CopyWithHeading':
                clipboard.copyRow(this.target.rowData, true)
                break;

            case 'AutoFit':
                table.columnResize.autoFit(this.target.column)
                break;

            case 'SortAsc':
                table.sort.sortColumn(this.target.column, ColumnSortOption.Asc)
                break;

            case 'SortDesc':
                table.sort.sortColumn(this.target.column, ColumnSortOption.Desc)
                break;

            default:
                break;
        }
    }
}
