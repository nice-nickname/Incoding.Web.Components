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
     * @type { {
     *  Columns: any[],
     *  RowTemplate: string,
     *  LayoutHtml: string,
     *  NestedField: string,
     *  NestedTable: any
     * } }
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
        const nestedTable = this.schema.NestedTable

        const record = this.data.find(s => s.RowId == rowId)
        const childData = record[this.schema.NestedField]

        const tr = document.createElement('tr')
        const td = document.createElement('td')

        tr.setAttribute('data-nested', true)
        tr.setAttribute('data-row-id', rowId)

        td.colSpan = this.schema.Columns.length

        td.classList.add('table-container')
        tr.appendChild(td)

        const html = ExecutableInsert.Template.render(nestedTable.LayoutHtml, { })

        const template = document.createElement('template')
        template.innerHTML = html

        const $table = $(template.content.children)

        td.appendChild(template.content)

        IncodingEngine.Current.parse($table)

        const $row = this.$table.find(`tr[data-row-id="${rowId}"]`)

        $row[0].after(tr)

        const nestedController = new TableController($table, nestedTable, childData, record)
        $table.data('grid', nestedController)

        nestedController.renderRows()
    }

    renderPlaceholderRows(amount = 3) {

    }

    rerenderRow(rowId) {

    }

    expand(rowId) {
        this.renderChildren(rowId)
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
