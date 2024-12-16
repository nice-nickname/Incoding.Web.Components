

class SplitGrid {

    static NAME = 'split-grid'

    /**
     * @type { string }
     */
    id

    /**
     * @type { InfitniteScrollOptions }
     */
    infiniteScroll

    /**
     * @type { UIOptions }
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

        this.schemaModel = options.tables.map(table => new TablePanelModel(table, this.services))

        this.#createElements(options)

        this.renderingStrategy = this.infiniteScroll
            ? new InfiniteScrollStrategy(this.dataSource, this.infiniteScroll, this.splitLayout.getPanels()[0])
            : new RenderingStrategy(this.dataSource)

        this.show()
    }

    render() {
        const panels = this.splitLayout.getPanels()

        this.splitTable = new SplitTable(this.dataSource, this.schemaModel, panels, this.services)
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

    #createElements(options) {
        this.rootElement = document.getElementById(this.id)
        this.rootElement.classList.add(classes.splitGrid)
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
}
