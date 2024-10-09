
class ColumnMenu {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { Menu }
     */
    #menu

    /**
     * @type { Column | null }
     */
    #currentColumn


    /**
     * @type { boolean }
     */
    #isOpen

    constructor(table) {
        this.table = table
        this.#currentColumn = null
        this.#isOpen = false

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()

        this.close()
        this.#menu.destroy()
    }

    /**
     * @param { Column } column
     */
    open(column) {
        this.#menu = new Menu({
            items: [
                { icon: 'ci-caret-up', text: 'Sort Asc', action: 'SortAsc', isDisabled: column.isStacked() },
                { icon: 'ci-caret-down', text: 'Sort Desc', action: 'SortDesc', isDisabled: column.isStacked() },
                { icon: 'ci-filter', text: 'Filter', action: 'Filter' },
                { isDivider: true },
                column.isPinned ?
                    { icon: 'ci-hand', text: 'Unpin', action: 'Unpin', isDisabled: column.hasStackedParent() }:
                    { icon: 'ci-hand', text: 'Pin', action: 'Pin', isDisabled: column.hasStackedParent() } ,
                { icon: 'ci-pencil', text: 'Rename', action: 'Rename', isDisabled: column.isStacked() },
                { text: 'Move column to Start', action: 'MoveStart', isDisabled: column.hasStackedParent() || column.isPinned },
                { text: 'Move column to End', action: 'MoveEnd', isDisabled: column.hasStackedParent() || column.isPinned },
                { isDivider: true },
                { icon: 'ci-trashcan', text: 'Remove', action: 'Remove' }
            ],
            onClick: this.#handleMenuClick.bind(this),
            onOpen: () => {
                const th = this.table.getColumnHeader(column.index)
                th.classList.add('active')
            },
            onClose: (menu) => {
                const th = this.table.getColumnHeader(column.index)
                th.classList.remove('active')
            },
            destroyOnHide: true
        })

        this.#currentColumn = column
        this.#isOpen = true

        const th = this.table.getColumnHeader(column.index)
        th.classList.add('active')

        const coordinates = th.getBoundingClientRect()

        this.#menu.show(coordinates.top + coordinates.height, coordinates.left)
    }

    close() {
        this.#menu.destroy()
        this.#currentColumn = null
        this.#isOpen = false
    }

    #addEventListeners() {
        this.table.thead.addEventListener('click', this.#handleClick)
    }

    #removeEventListeners() {
        this.table.thead.removeEventListener('click', this.#handleClick)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        if (ev.target.role === 'menu') {
            const th = $(ev.target).closest('th')[0]
            const column = this.table.getColumn(th.dataset.index)

            if (this.#isOpen) {
                const isSameColumn = this.#currentColumn == column

                this.close()
                if (isSameColumn) return
            }

            this.open(column)
        }
    }

    /**
     * @param { string } action
     */
    #handleMenuClick(action) {
        const column = this.#currentColumn

        switch (action) {
            case 'SortAsc':
                this.table.sort.sortColumn(column, ColumnSortOption.Asc)
                break;
            case 'SortDesc':
                this.table.sort.sortColumn(column, ColumnSortOption.Desc)
                break;
            case 'Filter':
                this.table.filter.createMenu(column)
                break
            case 'Pin':
                this.table.columnEdit.pin(column)
                break;
            case 'Unpin':
                this.table.columnEdit.unpin(column)
                break;
            case 'Rename':
                this.table.columnEdit.rename(column, 'monkey')
                break;
            case 'MoveStart':
                this.table.columnEdit.moveToStart(column)
                break;
            case 'MoveEnd':
                this.table.columnEdit.moveToEnd(column)
                break;
            case 'Remove':
                this.table.columnEdit.remove(column)
                break;
            default:
                break;
        }

        this.close()
    }
}

