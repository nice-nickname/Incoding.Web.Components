
class SplitTable {

    /**
     * @type { DataSource }
     */
    dataSource


    /**
     * @type { TablePanelModel[] }
     */
    schemaModel

    /**
     * @type { HTMLElement[] }
     */
    panelElements


    /**
     * @type { GridMode }
     */
    mode


    /**
     *  @type { ServiceCollection }
     */
    services


    /**
     * @type { TableHeaderRenderer }
     */
    headerRenderer

    /**
     * @type { TableFooterRenderer }
     */
    footerRenderer

    /**
     * @type { TableContentRenderer }
     */
    contentRenderer

    /**
     * @type { ColgroupRenderer }
     */
    colgroupsRenderer


    /**
     * @type { string }
     */
    id

    /**
     * Calling .abort() of this controller will remove
     * all event listeners automatically
     * @type { AbortController }
     */
    #abort

    /**
     * @type { { [rowId: string]: SplitTable } }
     */
    #nested = { }

    constructor(dataSource, schemaModel, panels, mode, services) {
        this.id = createGuid()

        this.dataSource = dataSource
        this.schemaModel = schemaModel
        this.panelElements = this.#createPanels(panels)

        this.mode = mode

        this.services = services

        this.headerRenderer = new TableHeaderRenderer(this)
        this.headerRenderer.renderPanels(this.panelElements)

        this.contentRenderer = new TableContentRenderer(this)
        this.contentRenderer.renderPanels(this.panelElements)
        this.contentRenderer.showNoRows()

        this.footerRenderer = new TableFooterRenderer(this)
        this.footerRenderer.renderPanels(this.panelElements)

        this.colgroupsRenderer = new ColgroupRenderer(this)
        this.colgroupsRenderer.render()

        this.#abort = new AbortController()

        this.columnMenu = new ColumnMenu(this);
        this.rowGroup = new RowGroup(this);
        this.sort = new Sort(this);
        this.rowDropdown = new RowDropdown(this);
        this.rowExpand = new RowExpand(this);
        this.contextMenu = new ContextMenu(this);
        this.rowHover = new RowHover(this);
        this.columnEdit = new ColumnEdit(this);
        this.columnResize = new ColumnResize(this);
    }

    render() {
        this.headerRenderer.render()
        this.footerRenderer.render()

        if (this.dataSource.getData().length !== 0) {
            this.appendData(this.dataSource.getData())
        }
    }

    destroy() {
        this.columnResize.destroy()
        this.columnEdit.destroy()
        this.rowHover.destroy()
        this.contextMenu.destroy()
        this.rowExpand.destroy()
        this.rowDropdown.destroy()
        this.sort.destroy()
        this.columnMenu.destroy()
        this.rowGroup.destroy()

        this.#abort.abort()

        this.headerRenderer.destroy()
        this.footerRenderer.destroy()
        this.contentRenderer.destroy()
    }

    clearData() {
        this.contentRenderer.showNoRows()
        this.contentRenderer.removeRows()
    }

    appendData(data) {
        this.contentRenderer.renderRows(data)

        if (this.dataSource.isDataLoading) {
            this.footerRenderer.setLoading()
        } else {
            this.footerRenderer.render()
        }
    }


    refresh() {
        this.refreshHeader()
        this.refreshFooter()
        this.refreshRows()
    }

    refreshHeader() {
        this.headerRenderer.render()
    }

    refreshFooter() {
        this.footerRenderer.render()
    }

    refreshRows() {
        this.contentRenderer.removeRows()
        this.contentRenderer.renderRows(this.dataSource.getData())
    }


    renderNested(rowIndex) {
        const rowData = this.dataSource.getData()[rowIndex]
        const rowId = rowData["RowId"]

        const tds = []

        const trs = this.getTrs(rowIndex)

        this.schemaModel.forEach((panelModel, i) => {
            const tr = trs[i]

            const nestedTr = document.createElement('tr')

            const td = document.createElement('td')
            td.classList.add(classes.nestedTableContainer)
            td.colSpan = panelModel.getFlatColumns().length + 1

            nestedTr.append(td)

            nestedTr.append(td)
            tr.after(nestedTr)

            tds.push(td)
        })

        const nestedField = this.getNestedField()

        const nestedData = this.rowGroup.isGrouped()
            ? rowData[RowGroup.GROUP_FIELD]
            : rowData[nestedField]

        const nestedDataSource = new DataSource(nestedData)
        const nestedSchema = this.schemaModel.map(s => s.nested)

        const nested = new SplitTable(nestedDataSource, nestedSchema, tds, this.services)
        nested.render()

        if (this.isStackedMode() && this.sort.isSorted()) {
            const sortedColumn = this.sort.sortedColumn

            nested.sort.sortColumn(sortedColumn, sortedColumn.sortedBy)
        }

        this.#nested[rowId] = nested
    }

    removeNested(rowIndex) {
        const rowData = this.dataSource.getData()[rowIndex]
        const rowId = rowData["RowId"]

        this.contentRenderer.tbodies.forEach((tbody) => {
            const tr = tbody.querySelector(`[data-row-index="${rowIndex}"]`)

            const nextTr = tr.nextSibling

            if (nextTr.role !== roles.row) {
                nextTr.remove()
            }
        })

        this.#nested[rowId].destroy()
    }


    getHeaderCell(uid) {
        for (const thead of this.headerRenderer.theads) {
            const th = thead.querySelector(`th[data-uid="${uid}"]`)

            if (th) {
                return th
            }
        }
    }

    getTrs(index) {
        const trs = []
        for (const tbody of this.contentRenderer.tbodies) {
            for (const tr of tbody.rows) {
                if (tr.dataset.rowIndex !== undefined && tr.dataset.rowIndex == index) {
                    trs.push(tr)
                    break
                }
            }
        }

        return trs
    }

    getPanelModelByColumn(column) {
        for (const panelModel of this.schemaModel) {
            if (panelModel.getColumn(column.uid)) {
                return panelModel
            }
        }

        return null
    }

    getAllColumns() {
        return this.schemaModel.flatMap(panel => {
            return panel.columns
        })
    }

    getAllFlatColumns() {
        return this.schemaModel.flatMap(panel => {
            return panel.getFlatColumns()
        })
    }

    getNestedField() {
        return this.schemaModel[0].nestedField
    }


    /**
     * @param { "header" | "body" } target
     * @param {  keyof HTMLElementEventMap } eventStr
     * @param { (event: Event, model: TablePanelModel, index: number) => void } callback
     */
    addManagedEventListener(target, eventStr, callback) {
        const targetElements = []

        this.panelElements.forEach(panel => {
            let selector
            switch (target) {
                case "body":
                    selector = 'tbody'
                    break;
                case "header":
                    selector = 'thead'
                    break
            }
            targetElements.push(panel.querySelector(selector))
        })

        targetElements.forEach((element, i) => {
            element.addEventListener(eventStr, event => {

                callback(event, this.schemaModel[i], i)

            }, { signal: this.#abort.signal })
        })
    }

    isStackedMode() {
        return this.mode === GridMode.Stacked
    }

    #createPanels(panels) {
        return panels.map(panel => {
            const tableContainer = document.createElement('div')
            tableContainer.classList.add('split-table-panel')
            tableContainer.dataset.id = this.id

            panel.append(tableContainer)
            return tableContainer
        })
    }
}
