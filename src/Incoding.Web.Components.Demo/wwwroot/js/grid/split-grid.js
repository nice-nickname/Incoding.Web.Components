

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
    schemas;

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

    constructor(element, schemas, options) {
        this.$root = $(element)
        this.$empty = this.$root.find('.grid-empty')
        this.$content = this.$root.find('.grid-splitter')

        this.hide()

        this.schemas = schemas;
        this.options = options

        this.initializeScroll();

        this.scrollEnabled = true
    }

    initializeTables() {
        this.show()

        this.$tables = this.$root.removeAttr('data-empty').find('table');

        this.data = []

        const parentData = {
            data: this.data,
            siblings: []
        }

        this.$tables.each((i, table) => {
            let controller = $(table).data('grid')

            if (!controller) {
                controller = new TableController(table, this.schemas[i], this.data, parentData)
            }

            controller.data = this.data
            controller.parent = parentData

            parentData.siblings.push(controller)

            controller.removeAllRows()

            controller.renderPlaceholderRows(20)
        })

        if (this.renderer) {
            return this.renderer.restart()
        }

        this.totals()
        this.initializeRenderer();
    }

    initializeScroll() {
        this.$scroller = this.$root.find('.splitter-pane');

        this.$scroller.connectScrolls()
    }

    initializeRenderer() {
        const { Scroll: scrollOptions } = this.options

        this.scrolledToEnd = !scrollOptions.Enabled

        this.renderer = scrollOptions.Enabled ?  new InfiniteScrollRenderer(this, scrollOptions.ChunkSize) : new AtOnceRenderer(this)
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
        const websocketOptions = this.options.Websocket

        this.$tables.each(function() {
            const controller = $(this).data('grid')

            controller.renderRows(start, end)

            if (dataLoading || !scrolledToEnd) {
                controller.renderPlaceholderRows(websocketOptions.LoadingRows)
            }
        })

        if (!this.dataLoading) {
            this.totals()
        }
    }

    totals() {
        this.$tables.first().data('grid').totals()
    }

    reload(data) {
        const rowId = data.RowId;
        const rowIndex = this.data.findIndex(s => s.RowId == rowId)

        if (rowIndex < 0) return

        this.data[rowIndex] = { ...this.data[rowIndex], ...data }

        this.$tables.each(function() {
            $(this).data('grid').rerenderRow(rowId)
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

        this.$scroller.each(function() {
            this.style.overflowY = 'hidden'
        })

        this.scrollEnabled = false
    }

    enableScroll() {
        if (this.scrollEnabled) return

        this.$scroller.each(function() {
            this.style.overflowY = 'auto'
        })

        this.scrollEnabled = true
    }
}
