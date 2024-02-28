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

    appendRows(start = 0, end = undefined) {
        if (!end) {
            end = this.data.length
        }

        const dataChunk = this.data.slice(start, end)

        this._renderRows(dataChunk)
    }

    renderChildren(rowId) { }

    expand(rowId) { }

    totals() { }

    filter(criteria) { }

    sort(criteria) { }

    _renderRows(data) {
        const html = ExecutableInsert.Template.render(this.schema.RowTemplate, { data })

        const template = document.createElement('template')
        template.innerHTML = html

        const $rows = $(template.content.children)

        this.$table[0].tBodies[0].appendChild(template.content)

        IncodingEngine.Current.parse($rows)
    }
}
