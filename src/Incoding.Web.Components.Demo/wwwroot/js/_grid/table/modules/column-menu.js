
class ColumnMenu {

    /**
     * @type { SplitTable }
     */
    splitTable


    /**
     * @type { Menu | null }
     */
    #menu = null

    /**
     * @type { ColumnModel | null }
     */
    #targetColumn = null

    /**
     * @type { TablePanelModel | null }
     */
    #targetPanel = null

    /**
     * @type { { top: number, left: number } }
     */
    #position = { }

    /**
     * @type { boolean }
     */
    #isOpen = false

    constructor(table) {
        this.splitTable = table

        this.splitTable.addManagedEventListener('header', 'click', this.#handleHeaderClick)
        this.splitTable.addManagedEventListener('header', 'contextmenu', this.#handleHeaderClick)
    }

    /**
     * @param { TablePanelModel } panelModel
     * @param { ColumnModel } column
     * @param { number } top
     * @param { number } left
     */
    open(panelModel, column, top, left) {
        const th = this.splitTable.getHeaderCell(column.uid)
        th.classList.add(classes.active)

        this.#menu = new Menu({
            items: this.#getMenuItems(panelModel, column),
            onOpen: () => this.#onMenuOpen(th),
            onClose: () => this.#onMenuClose(th),
            onClick: this.#onMenuClick,
        })

        this.#targetColumn = column
        this.#targetPanel = panelModel
        this.#position = { top, left }
        this.#isOpen = true

        this.#menu.show(top, left)
    }

    close() {
        this.#menu?.hide()
        this.#menu = null
        this.#targetColumn = null
        this.#targetPanel = null
        this.#isOpen = false
    }

    destroy() {
        this.close()
    }

    /**
     * @param { PointerEvent } ev
     * @param { TablePanelModel } panelModel
     */
    #handleHeaderClick = (ev, panelModel) => {
        const {
            target,
            button,
            clientX: left,
            clientY: top
        } = ev

        const prevTarget = this.#targetColumn

        this.close()

        const isContextMenu = button === ExecutableHelper.MouseButtons.Right

        if (target.role === roles.menu || isContextMenu) {
            const th = target.closest('th')
            const column = panelModel.getColumn(th.dataset.uid)

            ev.preventDefault()
            ev.stopPropagation()

            if (!column || !column.showMenu)
                return

            if (prevTarget === column && !isContextMenu)
                return

            this.open(panelModel, column, top, left)
        }
    }

    /**
     * @param { ColumnModel } column
     * @return { MenuItem[] }
     */
    #getMenuItems(panelModel, column) {
        const items = [];

        if (column.filterable) {
            items.push({ icon: 'ci-filter', text: 'Filter', action: 'Filter' });
        }

        if (column.sortable) {
            items.push(
                { icon: 'ci-caret-down', text: 'Sort Asc', action: 'SortAsc' },
                { icon: 'ci-caret-up', text: 'Sort Desc', action: 'SortDesc' }
            );
        }

        if (items.length !== 0) {
            items.push({ isDivider: true });
        }

        if (column.resizable) {
            items.push(...[
                { icon: 'ci-fit', text: 'Auto fit', action: 'AutoFit' },
                { icon: 'ci-fit', text: 'Auto fit All', action: 'AutoFitAll' }
            ]);

            items.push({ isDivider: true });
        }

        if (column.allowEdit) {
            this.#addEditItems(panelModel, items, column);
        }

        return items;
    }

    #addEditItems(panelModel, items, column) {
        if (!column.isStacked() && !column.isPinned) {
            items.push(this.splitTable.rowGroup.isGrouped()
                ? {
                    text: 'Ungroup',
                    action: 'Ungroup'
                }
                : {
                    text: 'Group By',
                    action: 'GroupBy'
                });
        }

        if (!column.hasStackedParent() && !column.isPinned) {
            const moveOptions = this.#getAvailableMoveOptions(panelModel, column)

            items.push({
                icon: 'ci-move-to',
                text: 'Move to',
                sideMenu: [
                    { text: 'First position', action: 'MoveStart' },
                    { text: 'Last position', action: 'MoveEnd' },
                    { isDivider: true },
                    ...moveOptions
                ],
            });
        }

        if (!column.hasStackedParent()) {
            items.push(...column.isPinned
                ? [
                    { icon: 'ci-unpin', text: 'Unpin', action: 'Unpin' },
                    { icon: 'ci-unpin', text: 'Unpin all', action: 'UnpinAll' }
                ]
                : [
                    { icon: 'ci-pin',text: 'Pin', action: 'Pin', isDisabled: column.hasStackedParent() },
                    { icon: 'ci-pin-before',text: 'Pin to this', action: 'PinToThis', isDisabled: column.hasStackedParent() }
                ]);
        }

        items.push(
            { isDivider: true },
            { icon: 'ci-pencil', text: 'Rename', action: 'Rename' },
            { icon: 'ci-trashcan', text: 'Remove', action: 'Remove' }
        );
    }

    /**
     * @param { TablePanelModel } panelModel
     * @param { ColumnModel } column
     * @returns { MenuItem[] }
     */
    #getAvailableMoveOptions(panelModel, column) {
        return panelModel.columns
            .filter(col => col != column && !col.isControlColumn() && !col.isPinned)
            .map(col => ({ text: col.title, action: 'MoveTo', subAction: col.uid }))
    }


    /**
     * @param { string? } action
     * @param { string? } subAction
     */
    #onMenuClick = (action, subAction) => {
        const column = this.#targetColumn
        const panel = this.#targetPanel
        // const cell = this.table.getColumnHeader(column)

        switch (action) {
            case 'SortAsc':
                this.splitTable.sort.sortColumn(column, SortOrder.Asc)
                break;
            case 'SortDesc':
                this.splitTable.sort.sortColumn(column, SortOrder.Desc)
                break;
            case 'Filter':
                this.splitTable.filter.showFilterMenu(column, this.#position.top, this.#position.left)
                break
            case 'Pin':
                this.splitTable.columnEdit.pin(column)
                break;
            case 'PinToThis':
                this.splitTable.columnEdit.pinUntil(column)
                break;
            case 'Unpin':
                this.splitTable.columnEdit.unpin(column)
                break;
            case 'UnpinAll':
                this.splitTable.columnEdit.unpinAll()
                break;
            case 'AutoFit':
                this.splitTable.columnResize.autoFit(column)
                break;
            case 'AutoFitAll':
                this.splitTable.columnResize.autoFitAll(panel)
                break;
            case 'Rename':
                // $(cell).popupInput({ placeholder: column.title, value: column.title })
                // $(cell).off('change').on('change', (ev, { value }) => {
                //     this.splitTable.columnEdit.rename(column, value)
                //     $(cell).off('change')
                // })
                break;
            case 'GroupBy':
                this.splitTable.rowGroup.groupBy(column)
                break;
            case 'Ungroup':
                this.splitTable.rowGroup.ungroup()
                break;
            case 'MoveStart':
                this.splitTable.columnEdit.moveToStart(column)
                break;
            case 'MoveEnd':
                this.splitTable.columnEdit.moveToEnd(column)
            case 'MoveTo':
                const beforeColumn = this.splitTable.getColumn(subAction)
                this.splitTable.columnEdit.moveBefore(column, beforeColumn)
                break;
            case 'Remove':
                this.splitTable.columnEdit.remove(column)
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
