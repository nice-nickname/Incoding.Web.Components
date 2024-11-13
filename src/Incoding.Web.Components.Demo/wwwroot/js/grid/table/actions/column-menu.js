
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
        th.classList.add(classes.active)

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
        const items = [];

        this.#addFilterItem(items, column);
        this.#addSortItems(items, column);
        this.#addEditItems(items, column);

        return items;
    }

    #addFilterItem(items, column) {
        if (column.filterable) {
            items.push({ icon: 'ci-filter', text: 'Filter', action: 'Filter' });
        }
    }

    #addSortItems(items, column) {
        if (column.sortable) {
            items.push(
                { icon: 'ci-caret-down', text: 'Sort Asc', action: 'SortAsc' },
                { icon: 'ci-caret-up', text: 'Sort Desc', action: 'SortDesc' }
            );
        }
    }

    #addEditItems(items, column) {
        if (!column.allowEdit) return;

        if (column.filterable || column.sortable) {
            items.push({ isDivider: true });
        }

        if (column.resizable) {
            items.push({ text: 'Auto fit', action: 'AutoFit' });
        }

        if (!column.hasStackedParent() && !column.isPinned) {
            const moveOptions = this.#getAvailableMoveOptions(column)

            items.push({
                text: 'Move to',
                sideMenu: [
                    { text: 'Start', action: 'MoveStart' },
                    { text: 'End', action: 'MoveEnd' },
                    { isDivider: true },
                    ...moveOptions
                ],
            });
        }

        if (!column.hasStackedParent()) {
            items.push(...column.isPinned ?
                [
                    { text: 'Unpin', action: 'Unpin' },
                    { text: 'Unpin all', action: 'UnpinAll' }
                ] :
                [
                    { text: 'Pin', action: 'Pin', isDisabled: column.hasStackedParent() },
                    { text: 'Pin to this', action: 'PinToThis', isDisabled: column.hasStackedParent() }
                ]);
        }

        items.push(
            { icon: 'ci-pencil', text: 'Rename', action: 'Rename' },
            { isDivider: true },
            { icon: 'ci-trashcan', text: 'Remove', action: 'Remove' }
        );
    }

    /**
     * @param { Column } column
     * @returns { MenuItem[] }
     */
    #getAvailableMoveOptions(column) {
        return this.table.columns
            .filter(col => col != column && !col.isControlColumn() && !col.isPinned)
            .map(col => ({ text: col.title, action: 'MoveTo', subAction: col.uid }))
    }


    /**
     * @param { string? } action
     * @param { string? } subAction
     */
    #onMenuClick = (action, subAction) => {
        const column = this.#targetColumn

        switch (action) {
            case 'SortAsc':
                this.table.sort.sortColumn(column, ColumnSortOrder.Asc)
                break;
            case 'SortDesc':
                this.table.sort.sortColumn(column, ColumnSortOrder.Desc)
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
        th.classList.add(classes.active)
    }

    #onMenuClose(th) {
        th.classList.remove(classes.active)
    }
}
