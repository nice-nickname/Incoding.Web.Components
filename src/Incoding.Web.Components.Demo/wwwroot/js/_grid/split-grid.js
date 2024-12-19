

class SplitGrid {

    static NAME = 'split-grid'

    /**
     * @type { string }
     */
    id

    /**
     * @type { IInfitniteScrollOptions }
     */
    infiniteScroll

    /**
     * @type { IUIOptions }
     */
    ui

    /**
     * @type { GridMode }
     */
    mode


    /** @type { HTMLElement } */
    rootElement

    /** @type { HTMLElement } */
    contentElement

    /** @type { HTMLElement } */
    emptyElement


    /** @type { TablePanelModel[] } */
    schemaModel



    /** @type { DataSource } */
    dataSource

    /** @type { ServiceCollection } */
    services

    /** @type { SplitTable } */
    splitTable

    /** @type { IRowRenderStrategy } */
    renderingStrategy


    /**
     * @type { SplitLayout }
     */
    splitLayout

    constructor(options) {
        this.id = options.id
        this.infiniteScroll = options.infiniteScroll
        this.ui = options.ui
        this.mode = options.mode

        this.services = new ServiceCollection()
        this.services.register(SplitGrid.NAME, this)
        this.services.register(FormatService.NAME, new FormatService(options.format))

        this.dataSource = new DataSource([])

        this.schemaModel = options.tables.map(table => new TablePanelModel(table, this.services))

        this.#createElements(options)

        const panels = this.splitLayout.getPanels()
        this.splitTable = new SplitTable(this.dataSource, this.schemaModel, panels, this.services)

        this.renderingStrategy = this.infiniteScroll
            ? new InfiniteScrollStrategy(this.splitTable, this.dataSource, this.infiniteScroll, this.splitTable.contentRenderer.elements[0])
            : new RenderingStrategy(this.splitTable, this.dataSource)

        this.#connectVerticalPanelsScroll()
        this.#connectHorizontalTableBodyScroll()

        this.show()
    }

    render() {
        this.splitTable.render()
    }

    destroy() {
        this.splitTable.destroy()
        this.splitLayout.destroy()
        this.rootElement.remove()
    }

    show() {
        this.contentElement.classList.remove(classes.hidden)
        this.emptyElement.classList.add(classes.hidden)
    }

    hide() {
        this.contentElement.classList.add(classes.hidden)
        this.emptyElement.classList.remove(classes.hidden)
    }

    showLoader() {
        this.rootElement.classList.add(classes.loading)
    }

    hideLoader() {
        this.rootElement.classList.remove(classes.loading)
    }


    clearData() {
        this.renderingStrategy.reset()
        this.dataSource.clear()

        this.splitTable.clearData()
    }

    /**
     * @param { Object[] | string } data
     */
    appendData(data) {
        if (data === undefined || data === null) {
            data = []
        }

        if (_.isString(data)) {
            data = JSON.parse(data || "[]")
        }

        this.dataSource.appendData(data)
        this.renderingStrategy.handleDataChanged()
    }


    #createElements(options) {
        this.rootElement = document.getElementById(this.id)
        this.rootElement.classList.add(classes.splitGrid, classes.loader)
        this.rootElement.classList.add(`split-grid-${this.mode.toString().toLowerCase()}`)
        this.rootElement.style.width = options.width
        this.rootElement.style.height = options.height

        this.splitLayout = new SplitLayout(options.splits)
        this.splitLayout.render()
        this.contentElement = this.splitLayout.root

        this.emptyElement = document.createElement('div')
        this.emptyElement.classList.add(classes.empty)
        this.emptyElement.innerHTML = options.emptyContent

        this.rootElement.append(
            this.contentElement,
            this.emptyElement
        )

        $(this.rootElement).data('splitGrid', this)
    }

    #connectVerticalPanelsScroll() {
        const scrollablePanels = this.splitTable.contentRenderer.elements

        const handleScroll = (ev) => {
            scrollablePanels.forEach(panel => {
                if (!panel.isSameNode(ev.target)) {
                    panel.scrollTop = ev.target.scrollTop
                }
            })
        }

        for (const panel of scrollablePanels) {
            panel.addEventListener('scroll', handleScroll)
        }
    }

    #connectHorizontalTableBodyScroll() {
        const scrollablePanels = this.splitTable.panelElements
        const bodyElements = this.splitTable.contentRenderer.elements

        const handleScroll = (ev) => {

        }

        for (let i = 0; i < scrollablePanels.length; i++) {
            const panel = scrollablePanels[i]
            const body = bodyElements[i]

            panel.addEventListener('scroll', (ev) => {
                body.scrollLeft = panel.scrollLeft
            })
        }
    }
}
