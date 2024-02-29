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
    parent

    /**
     * @type { any }
     */
    schema;

    constructor(element, schema, data, parent) {
        this.$table = $(element);
        this.schema = schema;
        this.data = data;
        this.parent = parent

        this.$table.data('grid', this)
    }

    renderRows(start = 0, end = undefined) {
        if (!end) {
            end = this.data.length
        }

        const dataChunk = this.data.slice(start, end)

        this._renderRows(dataChunk)
    }

    renderChildren(rowId) {

    }

    rerenderRow(rowId) {

    }

    expand(rowId) {
        console.log('expand', rowId)
    }

    totals() {

    }

    filter(criteria) {

    }

    sort(criteria) {

    }

    enableSort() {

    }

    disableSort() {

    }

    enableFilter() {

    }

    disableFilter() {

    }

    _renderRows(data) {
        const html = ExecutableInsert.Template.render(this.schema.RowTemplate, { data })

        const template = document.createElement('template')
        template.innerHTML = html

        const $rows = $(template.content.children)

        this.$table[0].tBodies[0].appendChild(template.content)

        IncodingEngine.Current.parse($rows)
    }
}
