class TableController {

    /**
     * @type { JQuery<HTMLTableElement> }
     */
    $table;

    /**
     * @type { any[] }
     */
    data;

    /**
     * @type { any }
     */
    schema;

    constructor(element, schema, data) {
        this.$table = $(element);
        this.schema = schema;
        this.data = data;
    }

    appendData(data) {
        this.data.push(...data);
    }

    renderRows() {
    }

    renderChildren(rowId) {
    }

    expand(rowId) {
    }

    totals() {
    }

    filter(criteria) {
    }

    sort(criteria) {
    }
}
