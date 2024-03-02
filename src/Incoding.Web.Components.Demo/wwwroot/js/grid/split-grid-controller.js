

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

    constructor(element, schemas, options) {
        this.$root = $(element);

        this.data = [];

        this.schemas = schemas;
        this.options = options

        this.initializeScroll();
        this.initializeTables();
    }

    initializeTables() {
        this.$tables = this.$root.find('table');

        const parentData = {
            data: this.data
        }

        this.$tables.each((i, table) => {
            const controller = new TableController(table, this.schemas[i], this.data, parentData, 20)

            controller.disableSort()
            controller.disableFilter()
        })
    }

    initializeScroll() {
        this.$scroller = this.$root.children();

        this.$scroller.connectScrolls()
    }

    appendData(data) {
        this.data.push(...data);
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
