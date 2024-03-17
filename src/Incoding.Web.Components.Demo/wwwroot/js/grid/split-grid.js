

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
     *  Columns: any[],
     *  RowTemplate: string,
     *  LayoutHtml: string,
     *  NestedField: string,
     *  NestedTable: any
     * }[] }
     */
    structure;

    /**
     * @type { }
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
                controller = new TableController(table, this.structure[i], this.data, parentData)
            }

            controller.data = this.data
            controller.parent = parentData

            parentData.siblings.push(controller)

            controller.removeAllRows()

            controller.renderPlaceholderRows(20)

            controller.hideTotals()
        })

        if (this.renderer) {
            return this.renderer.restart()
        }

        this.#initializeRenderer();
    }

    appendData(data) {
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
            loadingRowCount,
            partialLoading
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
        if (!this.scrollEnabled) return

        this.$scroller.scrollTop

        this.scrollEnabled = false
    }

    enableScroll() {
        if (this.scrollEnabled) return

        this.$scroller.each(function() {
            this.style.overflowY = 'auto'
        })

        this.scrollEnabled = true
    }

    resetScroll() {
        if (this.scrollEnabled) return

        this.$scroller.scrollTop(0)
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
