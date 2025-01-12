
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



    /** @type { ServiceCollection } */
    services

    /** @type { SplitTable } */
    splitTable


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


        this.schemaModel = options.tables.map(table => new TablePanelModel(table, this.services, this.mode))

        this.#createElements(options)

        const panels = this.splitLayout.getPanels()

        const dataSource = new DataSource([])

        this.splitTable = new SplitTable({
            dataSource: dataSource,
            mode: this.mode,
            parentElements: panels,
            schemaModel: this.schemaModel
        }, this.services)

        const renderingStrategy = this.infiniteScroll
            ? new InfiniteScrollStrategy(this.splitTable, this.infiniteScroll, this.splitTable.contentRenderer.elements[0])
            : new RenderingStrategy(this.splitTable)

        this.splitTable.setRenderingStrategy(renderingStrategy)


        this.#connectVerticalPanelsScroll()

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

        this.splitTable.appendData(data)
    }

    clearData() {
        this.splitTable.clearData()
    }


    /**
     * @param { IRecalculateData[] } data
     */
    recalculate(data) {
        this.splitTable.recalculate(data)

        IncodingEngine.Current.parse(this.rootElement)
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

        let prevScrollTop
        const handleScroll = (ev) => {
            const currentScrollTop = ev.target.scrollTop

            if (prevScrollTop === currentScrollTop) {
                return
            }

            prevScrollTop = currentScrollTop

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
}
