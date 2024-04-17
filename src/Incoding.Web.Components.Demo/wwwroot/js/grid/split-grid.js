

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
     * @type { {
     *  columns: any[],
     *  rowTmpl: string,
     *  layoutHtml: string,
     *  dropdownTmpl: string,
     *  hasDropdown: boolean,
     *  nestedField: string,
     *  nested: any
     * }[] }
     */
    structure;

    /**
     * @type { {
     *  infiniteScroll: boolean
     *  loadingRowCount: number
     *  scrollChunkSize: number
     * } }
     */
    options;

    /**
     * @type { {
     *  handleDataUpdated: () => void
     * } }
     */
    renderer

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

    constructor(element, options) {
        this.$root = $(element)
        this.$empty = this.$root.find('.grid-empty')
        this.$content = this.$root.find('.grid-splitter')

        this.$tables = this.$content.find('table');

        this.hide()

        this.structure = options.structure;
        this.options = options

        this.#initializeScroll();

        this.scrollEnabled = true
    }

    initializeTables() {
        this.show()

        this.data = []

        const parentData = {
            data: this.data,
            siblings: []
        }

        this.$tables.each((i, table) => {
            let controller = $(table).data('grid')

            if (!controller) {
                controller = new TableController(table, this.structure[i], this.options.table, this.data, parentData)
                controller.splitGrid = this
            }

            controller.data = this.data
            controller.parent = parentData

            parentData.siblings.push(controller)

            controller.removeAllRows()

            controller.renderPlaceholderRows(this.options.table.placeholderRows)

            controller.hideTotals()

            controller.$thead.find('[role=sort].active').removeClass('active').removeAttr('data-sort')
        })

        if (this.renderer) {
            return this.renderer.restart()
        }

        this.#initializeRenderer();
    }

    restart() {
        this.$tables.each((i, table) => {
            const controller = $(table).data('grid')

            controller.removeAllRows()
            controller.renderPlaceholderRows(this.options.table.placeholderRows)
            controller.hideTotals()
        })

        this.renderer.restart()
        this.renderer.handleDataUpdated()
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

        this.renderer.handleDataUpdated()

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
            const controller = $(this).data('grid')

            controller.renderRows(start, end)

            if (dataLoading || !scrolledToEnd) {
                controller.renderPlaceholderRows(loadingRowCount)
            }
        })

        if (!this.dataLoading) {
            this.totals()
        }
    }

    rerenderRow(data) {

    }

    totals() {
        this.$tables.each((i, table) => {
            let controller = $(table).data('grid')

            controller.totals()
            controller.showTotals()
        })
    }

    hide() {
        this.$empty.removeClass('hidden')
        this.$content.addClass('hidden')
    }

    show() {
        this.$empty.addClass('hidden')
        this.$content.removeClass('hidden')
    }

    disableScroll() {
        this.$scroller.each(function() {
            this.style.overflowY = 'hidden'
        })

        this.scrollEnabled = false
    }

    enableScroll() {
        this.$scroller.each(function() {
            this.style.overflowY = 'auto'
        })

        this.scrollEnabled = true
    }

    resetScroll() {
        this.$scroller.scrollTop(0)
    }

    enableSort() {
        this.$tables.find('[role=sort]').removeClass('disabled')
    }

    disableSort() {
        this.$tables.find('[role=sort]').addClass('disabled')
    }

    isScrollable() {
        return this.$scroller.isScrollable()
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

        this.renderer = infiniteScroll ?  new InfiniteScrollRenderer(this, scrollChunkSize) : new AtOnceRenderer(this)
    }
}
