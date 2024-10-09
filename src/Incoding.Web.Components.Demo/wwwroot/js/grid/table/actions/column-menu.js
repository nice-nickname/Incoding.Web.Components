
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
    #targetColumn


    /**
     * @type { boolean }
     */
    #isOpen

    constructor(table) {
        this.table = table
        this.#targetColumn = null
        this.#isOpen = false

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()

        this.close()
    }

    /**
     * @param { Column } column
     */
    open(column) {
        this.#menu = new Menu({
            items: this.#getMenuItems(column),
            onOpen: () => {
                const th = this.table.getColumnHeader(column)
                th.classList.add('active')
            },
            onClose: () => {
                const th = this.table.getColumnHeader(column)
                th?.classList.remove('active')
            },
            onClick: this.#handleMenuClick.bind(this),
        })

        this.#targetColumn = column
        this.#isOpen = true

        const th = this.table.getColumnHeader(column)
        th.classList.add('active')

        const coordinates = th.getBoundingClientRect()

        this.#menu.show(coordinates.top + coordinates.height, coordinates.left)
    }

    close() {
        this.#menu?.hide()
        this.#targetColumn = null
        this.#isOpen = false
    }

    #addEventListeners() {
        this.table.thead.addEventListener('click', this.#handleClick)
        this.table.thead.addEventListener('contextmenu', this.#handleClick)
    }

    #removeEventListeners() {
        this.table.thead.removeEventListener('contextmenu', this.#handleClick)
        this.table.thead.removeEventListener('click', this.#handleClick)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        const { target, button } = ev

        if (target.role === roles.menu || button === 2) {
            ev.preventDefault()
            ev.stopPropagation()

            const th = target.closest('th')
            const column = this.table.getColumn(th.dataset.uid)

            if (!column || !column.showMenu) return

            if (this.#isOpen) {
                const isSameColumn = this.#targetColumn === column
                this.close()
                if (isSameColumn) return
            }

            this.open(column)
        }
    }


    /**
     * @param { Column } column
     * @return { MenuItem[] }
     */
    #getMenuItems(column) {
        const columns = this.table.columns.filter(col => col != column && !col.isSpecialColumn())

        const moveSubMenuItems = columns.map(col => ({
            text: col.title,
            action: 'MoveTo',
            subAction: col.uid
        }))

        return [
            { icon: 'ci-filter', text: 'Filter', action: 'Filter', isDisabled: !column.filterable },
            { icon: 'ci-caret-up', text: 'Sort Asc', action: 'SortAsc', isDisabled: !column.sortable },
            { icon: 'ci-caret-down', text: 'Sort Desc', action: 'SortDesc', isDisabled: !column.sortable },
            { isDivider: true },
            column.isPinned ?
                { icon: 'ci-hand', text: 'Unpin', action: 'Unpin', isDisabled: column.hasStackedParent() }:
                { icon: 'ci-hand', text: 'Pin', action: 'Pin', isDisabled: column.hasStackedParent() } ,
            { icon: 'ci-pencil', text: 'Rename', action: 'Rename', isDisabled: column.isStacked() },
            { text: 'Move column to Start', action: 'MoveStart', isDisabled: column.hasStackedParent() || column.isPinned },
            { text: 'Move column to End', action: 'MoveEnd', isDisabled: column.hasStackedParent() || column.isPinned },
            {
                text: 'Move to',
                isDisabled: column.hasStackedParent() || column.isPinned || moveSubMenuItems.length === 0,
                sideMenu: moveSubMenuItems
            },
            { isDivider: true },
            { icon: 'ci-trashcan', text: 'Remove', action: 'Remove' }
        ]
    }


    /**
     * @param { string? } action
     * @param { string? } subAction
     */
    #handleMenuClick(action, subAction) {
        const column = this.#targetColumn

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
            case 'MoveTo':
                this.table.columnEdit.moveBefore(column, subAction)
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

