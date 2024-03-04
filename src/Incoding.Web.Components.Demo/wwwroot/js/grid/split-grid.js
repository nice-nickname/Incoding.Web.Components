

class SplitGridController {

    /**
     * @type { JQuery<HTMLElement> }
     */
    $root;

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
     * @type { {
     *  highlightRowsOnHover: boolean,
     * } }
     */
    options;

    /**
     * @type { {
     *  handleDataUpdated: () => void
     * } }
     */
    renderer

    constructor(element, schemas, options) {
        this.$root = $(element);

        this.data = [];

        this.schemas = schemas;
        this.options = options

        this.initializeScroll();
        this.initializeTables();

        this.initializeRenderer();
    }

    initializeTables() {
        this.$tables = this.$root.find('table');

        const parentData = {
            data: this.data
        }

        this.$tables.each((i, table) => {
            const controller = new TableController(table, this.schemas[i], this.data, parentData)

            controller.removeAllRows()

            controller.renderPlaceholderRows(20)

            controller.disableSort()
            controller.disableFilter()
        })
    }

    initializeScroll() {
        this.$scroller = this.$root.children();

        this.$scroller.connectScrolls()
    }

    initializeRenderer() {
        this.renderer = new InfiniteScrollRenderer(this, 20)
    }

    appendData(data) {
        this.data.push(...data);

        this.renderer.handleDataUpdated()
    }

    renderRows(start, end, hasMore = true) {
        this.$tables.each(function() {
            const controller = $(this).data('grid')

            controller.renderRows(start, end)

            if (hasMore) {
                controller.renderPlaceholderRows(3)
            }
        })
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
}
