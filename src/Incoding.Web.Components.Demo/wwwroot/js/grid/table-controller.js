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
     * @type { {
     *  siblings: TableController[]
     * } }
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

        if (!this.parent.siblings) {
            this.parent.siblings = []
        }

        this.parent.siblings.push(this)

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

        tr.classList.add('hidden')
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

    renderPlaceholderRows(count = 3) {
        const tr = document.createElement('tr')
        tr.setAttribute('temp-row')

        for (let i = 0; i < this.schema.Columns.length; i++) {
            const td = document.createElement('td')
            const span = document.createElement('span')
            span.innerHTML = '&nbsp;'
            span.classList.add('table-placeholder')
            td.appendChild(span)
            tr.appendChild(td)
        }

        return Array.from({ length: count }, () => tr.cloneNode(true))
    }

    rerenderRow(rowId) {

    }

    removeRow(rowId) {

    }

    expand(rowId) {
        this.parent.siblings.forEach(c => {
            const $row = c._findRow(rowId)

            if ($row.data('hasNested') !== true) {
                $row.data('hasNested', true)
                c.renderChildren(rowId)
            }

            $row.next().toggleClass('hidden')
        })
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

    _findRow(rowId) {
        const $row = $(this.$table[0].tBodies[0]).find(`tr[data-row-id="${rowId}"]`)
        return $row
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
