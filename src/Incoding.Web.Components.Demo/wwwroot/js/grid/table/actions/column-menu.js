
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
     */
    open(column) {
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

        const { bottom, left } = th.getBoundingClientRect()
        this.#menu.show(bottom, left)
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
        const { target, button } = ev

        if (target.role === roles.menu || button === 2) {
            const th = target.closest('th')
            const column = this.table.getColumn(th.dataset.uid)

            if (!column || !column.showMenu) return

            ev.preventDefault()
            ev.stopPropagation()

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
        return [
            { icon: 'ci-filter', text: 'Filter', action: 'Filter', isDisabled: !column.filterable },
            { icon: 'ci-caret-up', text: 'Sort Asc', action: 'SortAsc', isDisabled: !column.sortable },
            { icon: 'ci-caret-down', text: 'Sort Desc', action: 'SortDesc', isDisabled: !column.sortable },

            { isDivider: true },

            { text: 'Auto fit', action: 'AutoFit', isDisabled: !column.resizable },

            { text: 'Move column to Start', action: 'MoveStart', isDisabled: column.hasStackedParent() || column.isPinned },
            { text: 'Move column to End', action: 'MoveEnd', isDisabled: column.hasStackedParent() || column.isPinned },
            this.#getMoveToMenuItems(column),

            this.#getPinMenuItem(column),

            { icon: 'ci-pencil', text: 'Rename', action: 'Rename', isDisabled: column.isStacked() },

            { isDivider: true },

            { icon: 'ci-trashcan', text: 'Remove', action: 'Remove' }
        ]
    }

    /**
     * @param { Column } column
     * @returns { MenuItem }
     */
    #getPinMenuItem(column) {
        return column.isPinned ?
            { icon: 'ci-hand', text: 'Unpin', action: 'Unpin', isDisabled: column.hasStackedParent() } :
            { icon: 'ci-hand', text: 'Pin', action: 'Pin', isDisabled: column.hasStackedParent() }
    }

    /**
     * @param { Column } column
     * @returns { MenuItem }
     */
    #getMoveToMenuItems(column) {
        const availableColumns = this.table.columns.filter(
            col => col != column && !col.isSpecialColumn() && !col.isPinned
        );

        return {
            text: 'Move to',
            isDisabled: column.hasStackedParent() || column.isPinned || availableColumns.length === 0,
            sideMenu: availableColumns.map(subColumn => ({
                text: subColumn.title,
                action: 'MoveTo',
                subAction: subColumn.uid,
            }))
        }
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
            case 'Unpin':
                this.table.columnEdit.unpin(column)
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

