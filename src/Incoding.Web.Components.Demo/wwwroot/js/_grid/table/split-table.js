﻿
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
     * @type { IRowRenderStrategy }
     */
    #renderingStrategy

    /**
     * @type { { [rowId: string]: SplitTable } }
     */
    #nested = { }


    /**
     * @param { ISplitTableProps } props
     * @param { ServiceCollection } services
     */
    constructor(props, services) {
        const {
            dataSource,
            schemaModel,
            mode,
            parentElements
        } = props

        this.id = createGuid()

        this.dataSource = dataSource
        this.schemaModel = schemaModel
        this.panelElements = this.#createPanels(parentElements)

        this.mode = mode

        this.services = services

        this.headerRenderer = new TableHeaderRenderer(this)
        this.headerRenderer.renderPanels(this.panelElements)

        this.contentRenderer = new TableContentRenderer(this)
        this.contentRenderer.renderPanels(this.panelElements)
        this.contentRenderer.showNoRows()

        this.footerRenderer = new TableFooterRenderer(this)
        this.footerRenderer.render()

        this.colgroupsRenderer = new ColgroupRenderer(this)
        this.colgroupsRenderer.render()

        if (this.schemaModel.some(panel => panel.getFlatColumns().some(c => c.summaryExpr))) {
            this.summaryRenderer = new SummaryRenderer(this)
            this.summaryRenderer.render()
        }

        this.resizeColumnsToFit()

        this.#abort = new AbortController()
        this.#renderingStrategy = new RenderingStrategy(this)

        this.columnMenu = new ColumnMenu(this);
        this.rowGroup = new RowGroup(this);
        this.sort = new Sort(this);
        this.filter = new Filter(this);
        this.rowDropdown = new RowDropdown(this);
        this.rowExpand = new RowExpand(this);
        this.contextMenu = new ContextMenu(this);
        this.rowHover = new RowHover(this);
        this.columnResize = new ColumnResize(this);

        this.#connectHorizontalTableBodyScroll()
    }


    setRenderingStrategy(strategy) {
        this.#renderingStrategy = strategy
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
        this.rowHover.destroy()
        this.contextMenu.destroy()
        this.rowExpand.destroy()
        this.rowDropdown.destroy()
        this.filter.destroy()
        this.sort.destroy()
        this.columnMenu.destroy()
        this.rowGroup.destroy()

        this.#abort.abort()

        this.headerRenderer.destroy()
        this.footerRenderer.destroy()
        this.contentRenderer.destroy()
        this.summaryRenderer?.destroy()
    }

    clearData() {
        this.dataSource.clear()
        this.#renderingStrategy.reset()

        this.contentRenderer.showNoRows()
        this.contentRenderer.removeRows()
    }

    appendData(data) {
        this.dataSource.appendData(data)

        if (this.rowGroup.isGrouped()) {

        }

        if (this.filter.isFiltered()) {
            this.filter.updateDataSource()
        }

        this.#renderingStrategy.handleDataChanged()
    }

    appendRows(data) {
        this.contentRenderer.renderRows(data)

        if (this.dataSource.isDataLoading) {
            this.footerRenderer.setLoading()
            this.summaryRenderer?.setLoading()
        } else {
            this.footerRenderer.render()
            this.summaryRenderer?.render()
        }
    }

    /**
     * @param { IRecalculateData[] } updates
     */
    recalculate(updates) {
        const updateRequest = updates[0]
        const data = this.dataSource.getData()

        let rowId = ''

        if (this.rowGroup.isGrouped()) {
            const groupColumn = this.rowGroup.groupedColumn

            const oldGroup = data.find(item => {
                const group = item[RowGroup.GROUP_FIELD]

                return group.some(item => item.RowId === updateRequest.Data.RowId)
            })

            oldGroup[RowGroup.GROUP_FIELD].removeBy(item => item.RowId === updateRequest.Data.RowId)

            rowId = String(groupColumn.getValue(updateRequest.Data))

            const newGroup = data.find(item => item[RowGroup.KEY_FIELD] === rowId)
            newGroup[RowGroup.GROUP_FIELD].push(updateRequest.Data)

            this.refreshRow(oldGroup[RowGroup.KEY_FIELD], true)
        } else {
            rowId = updateRequest.Data.RowId

            const index = data.findIndex(item => item.RowId === rowId)
            data[index] = updateRequest.Data

            updates.shift()
        }

        if (updateRequest.WithChildren || updates.length > 0) {
            this.#nested[rowId]?.refreshRows()
        } else {
            this.#nested[rowId]?.recalculate(updates)
        }

        this.refreshRow(rowId)

        this.refreshFooter()
    }

    refreshRow(rowId, withChildren = false) {
        const trs = this.getTrsByRowId(rowId)

        const rowRenderer = new RowRenderer(this)
        for (let i = 0; i < trs.length; i++) {
            const oldTr = trs[i]
            const newTr = rowRenderer.render(this.schemaModel[i], oldTr.dataset.rowIndex)

            oldTr.replaceChildren(...newTr.children)
        }

        if (withChildren) {
            this.#nested[rowId]?.refreshRows()
        }
    }


    refresh() {
        this.refreshHeader()
        this.refreshFooter()
        this.refreshRows()
        this.colgroupsRenderer.refresh()
    }

    refreshHeader() {
        this.headerRenderer.render()
    }

    refreshFooter() {
        this.footerRenderer.render()
    }

    refreshRows() {
        this.contentRenderer.removeRows()

        this.#renderingStrategy.reset()
        if (this.dataSource.getData().length) {
            this.#renderingStrategy.handleDataChanged()
        }
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
            td.colSpan = panelModel.getFlatColumns().length

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

        const nested = new SplitTable({
            schemaModel: nestedSchema,
            parentElements: tds,
            mode: this.mode,
            dataSource: nestedDataSource
        }, this.services)
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

    getTrsByRowId(rowId) {
        const trs = []
        for (const tbody of this.contentRenderer.tbodies) {
            const tr = tbody.querySelector(`[role="${roles.row}"][data-row-id="${rowId}"]`)

            if (tr) {
                trs.push(tr)
            }
        }

        return trs
    }

    getHeaderTable(panelIndex) {
        return this.headerRenderer.tables[panelIndex]
    }

    getContentTable(panelIndex) {
        return this.contentRenderer.tables[panelIndex]
    }


    getAllColumns() {
        return this.schemaModel.flatMap(panel => {
            return panel.columns
        })
    }

    /**
     * @return {ColumnModel[]}
     */
    getAllFlatColumns() {
        return this.schemaModel.flatMap(panel => {
            return panel.getFlatColumns()
        })
    }

    getNestedField() {
        return this.schemaModel[0].nestedField
    }

    getDropdownTmpl() {
        return this.schemaModel[0].row.dropdownTmpl
    }


    getColumnEditModule(panelIndex) {
        return new ColumnEdit(this, this.schemaModel[panelIndex])
    }


    resizeColumnsToFit() {
        for (let panelIndex = 0; panelIndex < this.panelElements.length; panelIndex++) {
            const panel = this.panelElements[panelIndex]
            const columns = this.schemaModel[panelIndex].getFlatColumns()

            const columnsToFit = columns.filter(c => !c.width)

            if (columnsToFit.length === 0) {
                continue
            }


            let totalWidth = panel.clientWidth - 1
            if (panelIndex === this.panelElements.length - 1) {
                const scrollWidth = 10
                totalWidth -= scrollWidth;
            }

            const sizedWidth = DataUtil.aggregate(columns.filter(column => column.width), 'width', 'sum')
            const widthPerColumn = (totalWidth - sizedWidth) / columnsToFit.length

            requestAnimationFrame(() => {
                columnsToFit.forEach(column => {
                    this.columnResize.resize(panelIndex, column, widthPerColumn)
                })
            })
        }
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
                    selector = '.split-table-content > table > tbody'
                    break;
                case "header":
                    selector = '.split-table-header > table > thead'
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

    #connectHorizontalTableBodyScroll() {
        for (let i = 0; i < this.panelElements.length; i++) {
            const headerPanel = this.headerRenderer.elements[i]
            const contentPanel = this.contentRenderer.elements[i]

            let prevScrollLeft = 0;
            const scroll = (ev, left, right) => {
                const currentScrollLeft = ev.target.scrollLeft
                if (prevScrollLeft !== currentScrollLeft) {

                    right.scrollLeft = left.scrollLeft

                    prevScrollLeft = currentScrollLeft
                }
            }

            headerPanel.addEventListener('scroll', (ev) => scroll(ev, headerPanel, contentPanel))
            contentPanel.addEventListener('scroll', (ev) => scroll(ev, contentPanel, headerPanel))
        }
    }
}
