class TableController {

    /**
     * @type { JQuery<HTMLTableElement> }
     */
    $table;

    /**
     * @type { JQuery<HTMLTableSectionElement> }
     */
    $thead

    /**
     * @type { JQuery<HTMLTableSectionElement> }
     */
    $tbody

    /**
     * @type { JQuery<HTMLTableSectionElement> }
     */
    $tfoot

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

    constructor(element, schema, data, parent, placeholderCount = 0) {
        this.$table = $(element);
        this.$thead = $(element).find('thead')
        this.$tbody = $(element).find('tbody')
        this.$tfoot = $(element).find('tfoot')

        this.schema = schema;
        this.data = data;
        this.parent = parent

        if (!this.parent.siblings) {
            this.parent.siblings = []
        }

        if (placeholderCount != 0) {
            this.renderPlaceholderRows(placeholderCount)
        }

        this.parent.siblings.push(this)

        this.$table.data('grid', this)
    }

    expand(rowId) {
        const parentData = { }

        const isExpanded = this.schema.expands[rowId]
        const childRendered = isExpanded !== undefined

        this.schema.expands[rowId] = !isExpanded

        this.parent.siblings.forEach(c => {
            const $row = c._findRow(rowId)

            if (!childRendered) {
                c.renderChildren(rowId, parentData)
            }

            $row.next().toggleAttribute('data-expanded', 'true', 'false')
        })
    }

    totals() {
        this.parent.siblings.forEach(c => {
            const totalableCols = c.schema.Columns.filter(s => s.Totalable)

            totalableCols.forEach(col => {
                const { Index } = col

                let sum = 0

                const $cells = c.$tbody.children(':not([data-nested])').find(`td[data-index="${Index}"]`)

                $cells.each(function() {
                    sum += $(this).data('value')
                })

                c.$tfoot.find(`td[data-index="${Index}"] span`).each(function() {
                    $(this).attr('data-format', 'Numeric')
                    $(this).attr('data-value', sum)
                })
            })

            c.$tfoot.find('span[data-format]').format().removeAttr('data-format')
        })
    }

    filter(criteria) { }

    sort(criteria) { }

    format() {
        this.$table
            .find('td[data-format]')
            .format()
            .removeAttr('data-format')
    }

    renderRows(start = 0, end = undefined) {
        if (!end) {
            end = this.data.length
        }

        const dataChunk = this.data.slice(start, end)

        this.$table.find('[temp-row]').remove()

        this._renderRows(dataChunk)

        this.format()
    }

    renderChildren(rowId, parentData, expanded = false) {
        const nestedTable = this.schema.NestedTable

        const record = this.data.find(s => s.RowId == rowId)
        const childData = record[this.schema.NestedField]

        const tr = document.createElement('tr')
        const td = document.createElement('td')

        if (!expanded) {
            tr.classList.add('hidden')
        }

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

        const nestedController = new TableController($table[0], nestedTable, childData, parentData)
        $table.data('grid', nestedController)

        nestedController.renderRows()
        nestedController.totals()
    }

    renderPlaceholderRows(count) {
        const tr = document.createElement('tr')
        tr.setAttribute('temp-row', true)

        for (let i = 0; i < this.schema.Columns.length; i++) {
            const td = document.createElement('td')
            const span = document.createElement('span')
            span.innerHTML = '&nbsp;'
            span.classList.add('table-placeholder')
            td.appendChild(span)
            tr.appendChild(td)
        }

        const rows = Array.from({ length: count }, () => tr.cloneNode(true))

        this.$tbody[0].append(...rows)
    }

    rerenderRow(rowId) {
        const $row = this._findRow(rowId)
        const rowData = this.data.find(s => s.RowId == rowId)

        this._rerenderSelfRow($row, rowData)

        if ($row.data('hasNested') === true) {
            const nestedData = rowData[this.schema.NestedField]

            this._rerenderNestedRow($row.next(), nestedData)
        }
    }

    removeRow(rowId) {

    }

    enableSort() { }

    disableSort() { }

    enableFilter() { }

    disableFilter() { }

    _findRow(rowId) {
        const bodyEl = this.$table[0].tBodies[0]
        const selector = `tr[data-row-id="${rowId}"]:not([data-nested])`

        return $(bodyEl).find(selector)
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
