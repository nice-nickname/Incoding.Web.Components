
class SplitGridController {

    /**
     * @type { JQuery<HTMLElement> }
     */
    $root;

    /**
     * @type { JQuery<HTMLElement> }
     */
    $empty;

    /**
     * @type  { JQuery<HTMLElement> }
     */
    $content;

    /**
     * @type { JQuery<HTMLElement> }
     */
    $scroller;

    /**
     * @type { JQuery<HTMLTableElement> }
     */
    $tables;

    /**
     * @type { any[] }
     */
    data;

    /**
     * @type { any[] }
     */
    originData

    /**
     * @type { TableStructure[] }
     */
    structure;

    /**
     * @type { GridOptions }
     */
    options;

    /**
     * @type { IRowRenderer }
     */
    rowRenderer

    /**
     * @type { boolean }
     */
    dataLoading

    /**
     * @type { boolean }
     */
    scrolledToEnd

    /**
     * @type  { boolean }
     */
    scrollEnabled

    /**
     * @type { TableController[] }
     */
    tables

    constructor(element, options) {
        this.$root = $(element)
        this.$empty = this.$root.find('.grid-empty')
        this.$content = this.$root.find('.grid-splitter')

        this.$tables = this.$content.find('table');

        this.structure = options.structure;
        this.options = options

        this.data = []
        this.originData = this.data

        this.#initializeScroll()
        this.#initializeRenderer()
        this.#initializeTables()

        this.enableScroll()
        this.hide()
    }


    initializeTables() { // m-debug rename
        this.show()

        this.data = []

        this.tables.forEach(table => {
            table.data = this.data
            table.originData = this.data

            table.removeAllRows()
            table.renderPlaceholderRows()
            table.hideTotals()

            table.sortController.reset()
            table.sortController.setDefaultSort()
        })

        this.rowRenderer.restart()
    }

    rerender() {
        this.tables.forEach(table => {
            table.removeAllRows()
            table.renderPlaceholderRows()
            table.hideTotals()
        })

        this.rowRenderer.restart()
        this.rowRenderer.handleDataUpdated()
    }

    appendData(data) {
        if (_.isString(data)) {
            data = _.unescape(data)

            data = JSON.parse(data || "[]")
        }

        if (!data) {
            data = []
        }

        this.data.push(...data);

        this.rowRenderer.handleDataUpdated()

        if (this.data.length === 0) {
            this.hide()
        }
    }

    renderRows(start, end) {
        const dataLoading = this.dataLoading
        const scrolledToEnd = this.scrolledToEnd

        const {
            loadingRowCount
        } = this.options

        this.$tables.each(function() {
            const controller = $(this).data('table')

            controller.renderRows(start, end)

            if (dataLoading || !scrolledToEnd) {
                controller.renderPlaceholderRows(loadingRowCount)
            }
        })

        if (!this.dataLoading) {
            this.totals()
        }
    }

    totals() {
        this.tables.forEach(table => {
            table.totals()
            table.showTotals()
        })
    }

    show() {
        this.$empty.addClass('hidden')
        this.$content.removeClass('hidden')
    }

    hide() {
        this.$empty.removeClass('hidden')
        this.$content.addClass('hidden')
    }

    enableScroll() {
        this.$scroller.each(function() {
            this.style.overflowY = 'auto'
        })

        this.scrollEnabled = true
    }

    disableScroll() {
        this.$scroller.each(function() {
            this.style.overflowY = 'hidden'
        })

        this.scrollEnabled = false
    }

    resetScroll() {
        this.$scroller.scrollTop(0)
    }

    isScrollable() {
        return this.$scroller.isScrollable()
    }

    enableSort() {
        this.tables.forEach(table => {
            table.sortController.enable()
        })
    }

    disableSort() {
        this.tables.forEach(table => {
            table.sortController.disable()
        })
    }

    enableFilter() {
        this.tables.forEach(table => {
            table.filterController.enable()
        })
    }

    disableFilter() {
        this.tables.forEach(table => {
            table.filterController.disable()
        })
    }

    #initializeTables() {
        this.tables = []
        const parentData = { siblings: [] }

        this.$tables.each((i, table) => {
            let controller = new TableController(table, this.structure[i], this.options.table, this.data, parentData)
            controller.splitGrid = this

            controller.data = this.data
            controller.originData = this.data
            controller.parent = parentData

            parentData.siblings.push(controller)
            this.tables.push(controller)
        })
    }

    #initializeScroll() {
        this.$scroller = this.$root.find('.splitter-pane');

        this.$scroller.connectScrolls()
    }

    #initializeRenderer() {
        const {
            infiniteScroll,
            scrollChunkSize
        } = this.options

        this.scrolledToEnd = !infiniteScroll

        this.rowRenderer = infiniteScroll ?
            new InfiniteScrollRowRenderer(this, scrollChunkSize) :
            new ImmediateRowRenderer(this)
    }
}
