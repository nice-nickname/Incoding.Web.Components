

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
            const controller = new TableController(table, this.schemas[i], this.data, parentData)

            controller.disableSort()
            controller.disableFilter()
        })
    }

    initializeScroll() {
        this.$scroller = this.$root.children();

        this.$scroller.connectScrolls()
        /** listen to scroll here... */
    }

    appendData(data) {
        this.data.push(...data);
    }

    renderRows(start, end) {
        this.$tables.each(function() {
            $(this).data('grid').renderRows(start, end)
        })
    }

    reload(data) {
        const rowId = data.RowId;

        const item = this.data.find(s => s.RowId == rowId);
    }
}
