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
     *  columns: any[],
     *  rowTmpl: string,
     *  layoutHtml: string,
     *  dropdownTmpl: string,
     *  hasDropdown: boolean,
     *  nestedField: string,
     *  nested: any
     * } }
     */
    structure;

    /**
     * @type { {
     *  [key: string]: boolean
     * } }
     */
    nested

    constructor(element, structure, data, parent) {
        this.$table = $(element);
        this.$thead = $(element).find('thead')
        this.$tbody = $(element).find('tbody')
        this.$tfoot = $(element).find('tfoot')

        this.structure = structure;
        this.data = data;
        this.parent = parent

        this.$table.data('grid', this)

        this.nested = { }

        this.#hoverableRows()
    }

    expand(rowId) {
        const isExpanded = this.structure.expands[rowId]

        this.structure.expands[rowId] = !isExpanded

        const parentData = { siblings: [] }

        this.parent.siblings.forEach(table => {
            const $row = table.#findRow(rowId)

            if (!table.nested[rowId]) {
                table.renderChildren(rowId, parentData)

                table.nested[rowId] = true
            }

            $row.next().toggleAttribute('data-expanded', 'true', 'false')
        })
    }

    totals() {
        const totalableCols = this.structure.columns.filter(s => s.totalable)

        totalableCols.forEach(col => {
            const {
                index,
                field,
                spreadIndex,
                spreadField,
                format
            } = col

            let fieldAccessor = data => data[field]

            if (!ExecutableHelper.IsNullOrEmpty(spreadField)) {
                fieldAccessor = data => data[spreadField][spreadIndex][field]
            }

            const total = this.data.reduce((sum, data) => {
                const value = Number(fieldAccessor(data)) || 0
                return sum += value
            }, 0)

            this.$tfoot.find(`td[data-index="${index}"] span`).each(function () {
                $(this).attr('data-format', format)
                $(this).attr('data-value', total)
            })
        })

        var cells = this.$tfoot.find('span[data-format]').format()

        cells.removeAttr('data-format')
    }

    filter(criteria) {

    }

    sort(criteria) {

    }

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

        this.#renderRows(dataChunk)

        this.format()
    }

    renderChildren(rowId, parentData, expanded = false) {
        const nestedTable = this.structure.nested

        const record = this.data.find(s => s.RowId == rowId)
        const childData = record[this.structure.nestedField]

        const tr = document.createElement('tr')
        const td = document.createElement('td')

        tr.setAttribute('data-nested', !expanded)
        tr.setAttribute('data-row-id', rowId)

        td.colSpan = this.structure.columns.length

        td.classList.add('table-container')
        tr.appendChild(td)

        const html = ExecutableInsert.Template.render(nestedTable.layoutTmpl, {})

        const template = document.createElement('template')
        template.innerHTML = html

        const $table = $(template.content.children)

        td.appendChild(template.content)

        IncodingEngine.Current.parse($table)

        const $row = this.$table.find(`tr[data-row-id="${rowId}"]`)

        $row[0].after(tr)

        const nestedController = new TableController($table[0], nestedTable, childData, parentData)
        $table.data('grid', nestedController)

        parentData.siblings.push(nestedController)

        nestedController.renderRows()
        nestedController.totals()
    }

    renderPlaceholderRows(count) {
        const tr = document.createElement('tr')
        tr.setAttribute('temp-row', true)

        for (let i = 0; i < this.structure.columns.length; i++) {
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

    removeRow(rowId) {
        const rowIndex = this.data.findIndex(s => s.RowId == rowId)

        if (rowIndex > -1) {
            this.data.splice(rowIndex, 1)
        }

        this.parent.siblings.forEach(table => {
            table.$tbody.find(`tr[data-row-id="${rowId}"]`).remove()

            if (table.$tbody.children().length === 0) {
                table.$table.remove()
            }

            this.parent = null
        })
    }

    removeAllRows() {
        this.$tbody.empty()

        this.nested = { }
    }

    hideTotals() {
        this.$tfoot.find('span').addClass('table-placeholder')
    }

    showTotals() {
        this.$tfoot.find('span').removeClass('table-placeholder')
    }

    showDropdown(rowId) {
        if (!this.structure.hasDropdown) {
            return
        }

        const $row = this.#findRow(rowId)
        const $invoker = $row.find('[data-dropdown-invoker]')

        if ($(document.body).find(`[data-dropdown-id="${rowId}"]`).length !== 0) {
            return
        }

        const $dropdown = this.#renderDropdown($invoker, rowId)

        $dropdown
            .appendTo(document.body)
            .find('> button').trigger('click')

    }

    #renderDropdown($invoker, rowId) {
        const record = this.data.find(s => s.RowId == rowId)
        const $dropdown = $(ExecutableInsert.Template.render(this.structure.dropdownTmpl, {
            data: [record]
        }))

        IncodingEngine.Current.parse($dropdown)

        const bounds = $invoker[0].getBoundingClientRect()

        return $dropdown
            .attr('data-dropdown-id', rowId)
            .css({
                top: bounds.top + bounds.height,
                left: bounds.left,
                position: 'absolute'
            })
            .on('hidden.bs.dropdown', () => {
                $dropdown.remove()
            })
            .on('shown.bs.dropdown', () => {
                requestAnimationFrame(() => {
                    $dropdown.find('ul').css('transform', '')
                })
            })
    }

    #findRow(rowId) {
        const selector = `tr[data-row-id="${rowId}"]:not([data-nested])`

        return this.$tbody.find(selector)
    }

    #renderRows(data) {
        const html = ExecutableInsert.Template.render(this.structure.rowTmpl, { data })

        const template = document.createElement('template')
        template.innerHTML = html

        const $rows = $(template.content.children)

        this.$table[0].tBodies[0].appendChild(template.content)

        IncodingEngine.Current.parse($rows)
    }

    #hoverableRows() {
        let prevRowIndex = -1

        this.$tbody[0].addEventListener('mouseover', (ev) => {
            ev.stopPropagation()

            const $row = $(ev.target).closest('tr')
            const rowIndex = $row.index()

            const isNeedHighlight = $row.is('[body-row]')


            this.parent.siblings.forEach(table => {
                const $candidate = table.$tbody.children().eq(rowIndex)
                const $prev = table.$tbody.children().eq(prevRowIndex)

                $prev.removeClass('highlight')

                if (isNeedHighlight) {
                    $candidate.addClass('highlight')
                }
            })

            prevRowIndex = rowIndex
        })

        this.$tbody[0].addEventListener('mouseleave', (ev) => {
            ev.stopPropagation()

            this.parent.siblings.forEach(table => {
                const $candidate = table.$tbody.children()
                $candidate.removeClass('highlight')
            })
        })
    }
}
