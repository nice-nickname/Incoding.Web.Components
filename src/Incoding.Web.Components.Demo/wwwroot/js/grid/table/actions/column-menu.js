
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

    /**
     * @param { Column } column
     * @param { number } top
     * @param { number } left
     */
    open(column, top, left) {
        const th = this.table.getColumnHeader(column)
        th.classList.add('active')

        this.#menu = new Menu({
            items: this.#getMenuItems(column),
            onOpen: () => this.#onMenuOpen(th),
            onClose: () => this.#onMenuClose(th),
            onClick: this.#onMenuClick,
        })

        this.#targetColumn = column
        this.#isOpen = true

        this.#menu.show(top, left)
    }

    close() {
        this.#menu?.hide()
        this.#menu = null
        this.#targetColumn = null
        this.#isOpen = false
    }

    destroy() {
        this.#removeEventListeners()
        this.close()
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
        const {
            target,
            button,
            clientX: left,
            clientY: top
        } = ev

        const prevTarget = this.#targetColumn

        if (this.#isOpen) {
            this.close()
        }

        const isContextMenu = button === ExecutableHelper.MouseButtons.Right

        if (target.role === roles.menu || isContextMenu) {
            const th = target.closest('th')
            const column = this.table.getColumn(th.dataset.uid)

            ev.preventDefault()
            ev.stopPropagation()

            if (!column || !column.showMenu)
                return

            if (!isContextMenu && prevTarget === column)
                return

            this.open(column, top, left)
        }
    }

    /**
     * @param { Column } column
     * @return { MenuItem[] }
     */
    #getMenuItems(column) {
        return [
            { icon: 'ci-filter', text: 'Filter', action: 'Filter', isDisabled: !column.filterable },
            { icon: 'ci-caret-down', text: 'Sort Asc', action: 'SortAsc', isDisabled: !column.sortable },
            { icon: 'ci-caret-up', text: 'Sort Desc', action: 'SortDesc', isDisabled: !column.sortable },

            { isDivider: true },

            { text: 'Auto fit', action: 'AutoFit', isDisabled: !column.resizable },

            {
                text: 'Move to',
                isDisabled: column.hasStackedParent() || column.isPinned,
                sideMenu: this.#getMoveToMenuItems(column)
            },

            ...this.#getPinMenuItems(column),

            { icon: 'ci-pencil', text: 'Rename', action: 'Rename', isDisabled: column.isStacked() },

            { isDivider: true },

            { icon: 'ci-trashcan', text: 'Remove', action: 'Remove' }
        ]
    }

    /**
     * @param { Column } column
     * @returns { MenuItem[] }
     */
    #getPinMenuItems(column) {

        return column.isPinned ?
            [
                { text: 'Unpin', action: 'Unpin' },
                { text: 'Unpin all', action: 'UnpinAll' }
            ] :
            [
                { text: 'Pin', action: 'Pin', isDisabled: column.hasStackedParent() },
                { text: 'Pin to this', action: 'PinToThis', isDisabled: column.hasStackedParent() }
            ]
    }

    /**
     * @param { Column } column
     * @returns { MenuItem[] }
     */
    #getMoveToMenuItems(column) {
        const items = [
            { text: 'Start', action: 'MoveStart' },
            { text: 'End', action: 'MoveEnd' },
        ]

        const columns = this.table.columns
            .filter(col => col != column && !col.isControlColumn() && !col.isPinned)
            .map(col => ({ text: col.title, action: 'MoveTo', subAction: col.uid }));

        if (columns.length !== 0) {
            items.push(
                { isDivider: true },
                ...columns
            )
        }

        return items
    }


    /**
     * @param { string? } action
     * @param { string? } subAction
     */
    #onMenuClick = (action, subAction) => {
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
            case 'PinToThis':
                this.table.columnEdit.pinUntil(column)
                break;
            case 'Unpin':
                this.table.columnEdit.unpin(column)
                break;
            case 'UnpinAll':
                this.table.columnEdit.unpinAll()
                break;
            case 'AutoFit':
                this.table.columnResize.autoFit(column)
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
                const beforeColumn = this.table.getColumn(subAction)
                this.table.columnEdit.moveBefore(column, beforeColumn)
                break;
            case 'Remove':
                this.table.columnEdit.remove(column)
                break;
            default:
                break;
        }

        this.close()
    }

    #onMenuOpen(th) {
        th.classList.add('active')
    }

    #onMenuClose(th) {
        th.classList.remove('active')
    }
}
