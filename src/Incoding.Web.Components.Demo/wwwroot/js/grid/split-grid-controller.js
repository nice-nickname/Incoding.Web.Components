

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
     * @type { any[] }
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

        this.initializeScroll();
        this.initializeTables();
    }

    initializeTables() {
        this.$tables = this.$root.find('table');

    }

    initializeScroll() {
        this.$scroller = this.$root.children().first();

        /** listen to scroll here... */
    }

    appendData(data) {
        this.data.push(...data);
    }

    reload(data) {
        const rowId = data.RowId;

        const item = this.data.find(s => s.RowId == rowId);
    }
}
