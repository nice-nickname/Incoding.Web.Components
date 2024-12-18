
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
     * @type { {
     *     column: ColumnModel | null
     * } }
     */
    groupModel = { column: null }


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

        this.footerRenderer = new TableFooterRenderer(this)
        this.footerRenderer.renderPanels(this.panelElements)


        this.#abort = new AbortController()
    }

    render() {
        this.headerRenderer.render()
        this.footerRenderer.render()
    }

    destroy() {
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
