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
     * Calling .abort() of this controller will remove
     * all event listeners automatically
     * @type { AbortController }
     */
    #abort

    constructor(dataSource, schemaModel, panels, services) {
        this.dataSource = dataSource
        this.schemaModel = schemaModel
        this.panelElements = panels.map(panel => {
            const tableContainer = document.createElement('div')
            tableContainer.classList.add('split-table-panel')

            panel.append(tableContainer)
            return tableContainer
        })
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
    }

    render() {
        this.headerRenderer.render()
        this.footerRenderer.render()

        if (this.dataSource.getData().length !== 0) {
            this.appendData(this.dataSource.getData())
        }
    }

    destroy() {
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
        this.headerRenderer.render()
        this.footerRenderer.render()

        this.contentRenderer.removeRows()
        this.contentRenderer.renderRows(this.dataSource.getData())
    }

    refreshRows() {
        this.contentRenderer.removeRows()
        this.contentRenderer.renderRows(this.dataSource.getData())
    }


    renderNested(rowIndex) {
        const data = this.dataSource.getData()[rowIndex]

        const tds = []

        this.contentRenderer.tbodies.forEach((tbody) => {
            const tr = tbody.querySelector(`[data-row-index="${rowIndex}"]`)

            const nestedTr = document.createElement('tr')

            const td = document.createElement('td')
            td.colSpan = 228

            nestedTr.append(td)

            nestedTr.append(td)
            tr.after(nestedTr)

            tds.push(td)
        })

        const nestedDataSource = new DataSource(data["Children"])
        const nestedSchema = this.schemaModel.map(s => s.nested)

        const nested = new SplitTable(nestedDataSource, nestedSchema, tds, this.services)
        nested.render()
    }

    removeNested(rowIndex) {
        this.contentRenderer.tbodies.forEach((tbody) => {
            const tr = tbody.querySelector(`[data-row-index="${rowIndex}"]`)

            const nextTr = tr.nextSibling

            if (nextTr.role !== roles.row) {
                nextTr.remove()
            }
        })
    }


    /**
     * m-debug rename
     * @param { string } uid
     */
    getColumnHeader(uid) {
        for (const thead of this.headerRenderer.theads) {
            const th = thead.querySelector(`th[data-uid="${uid}"]`)

            if (th) {
                return th
            }
        }
    }


    /**
     * @param { "header" | "body" } target
     * @param {  keyof HTMLElementEventMap } eventStr
     * @param { (event: Event, model: TablePanelModel) => void } callback
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

                callback(event, this.schemaModel[i])

            }, { signal: this.#abort.signal })
        })
    }

}
