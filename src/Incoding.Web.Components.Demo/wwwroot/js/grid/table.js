function triggerRerender(data) {
    for (const recalculate of data) {
        const $rows = $(`[data-row-id="${recalculate.Current.RowId}"][role=row]`).addClass('loading')

        const table = $rows.closest('table').data('table')

        table?.rerenderRow({
            record: recalculate.Current,
            withChildren: recalculate.WithChildren || false
        })
    }

    setTimeout(() => {
        for (const recalculate of data) {
            const $rows = $(`[data-row-id="${recalculate.Current.RowId}"][role=row]`).removeClass('loading')

            $rows.removeClass('loading')
        }
    }, 150)
};

class TableController {

    /**
     * @type { JQuery<HTMLTableElement> }
     */
    $table;

    /**
     * @type { JQuery<HTMLTableSectionElement> }
     */
    $header

    /**
     * @type { JQuery<HTMLTableSectionElement> }
     */
    $body

    /**
     * @type { JQuery<HTMLTableSectionElement> }
     */
    $footer

    /**
     * @type { any[] }
     */
    data;

    /**
     * @type { any[] }
     */
    originData

    /**
     * @type { {
     *  siblings: TableController[]
     * } }
     */
    parent

    /**
     * @type { TableStructure }
     */
    structure;

    /**
     * @type { TableOptions }
     */
    options;

    /**
     * @type { {
     *  [key: string]: boolean
     * } }
     */
    nested

    /**
     * @type {
     *  [key: string]: boolean
     * }
     */
    expands

    /**
     * @type  { SplitGridController | undefined }
     */
    splitGrid

    /**
     * @type { SortController }
     */
    sortController

    /**
     * @type { FilterController }
     */
    filterController

    constructor(element, structure, options, data, parent) {
        this.$table = $(element);
        this.$header = $(element).find('thead')
        this.$body = $(element).find('tbody')
        this.$footer = $(element).find('tfoot')

        this.structure = structure;
        this.options = options
        this.data = data;
        this.originData = data;
        this.parent = parent

        this.$table.data('table', this)

        this.nested = { }
        this.expands = { }

        this.sortController = new SortController(this, this.structure.columns.find(s => s.sortedBy != null))
        this.filterController = new FilterController(this)

        if (this.options.highlightRows) {
            this.#hoverableRows()
        }
    }

    isSimpleMode() {
        return this.options.mode === 'Simple'
    }

    expand(rowId) {
        const isExpanded = this.expands[rowId]

        const parentData = { siblings: [] }

        this.parent.siblings.forEach(table => {
            table.expands[rowId] = !isExpanded
            const $row = table.#findRow(rowId)

            if (!table.nested[rowId]) {
                table.renderChildren(rowId, parentData)

                table.nested[rowId] = true
            }

            if ($row.next().is('[data-nested]')) {
                $row.next().toggleAttribute('data-expanded', 'true', 'false')
            }
        })

        const $row = this.#findRow(rowId)
        const $expander = $row.find('[role=expand]')

        $expander.attr('data-expand', !isExpanded ? 'expanded' : 'collapsed')
    }

    totals() {
        const totalableCols = this.structure.columns.filter(s => s.totalable)

        totalableCols.forEach(column => {
            const {
                index,
                format
            } = column

            const getter = this.getFieldAccessorByColumn(column)

            const total = this.data.reduce((sum, data) => {
                const value = Number(getter(data)) || 0
                return sum += value
            }, 0)

            this.$footer.find(`td[data-index="${index}"] span`).each(function () {
                $(this).attr('data-format', format)
                       .attr('data-value', total)
                       .attr('total', total)
            })
        })

        var cells = this.$footer.find('span[data-format]').format()

        cells.removeAttr('data-format')
    }

    format() {
        this.$table
            .find('td[data-format]')
            .format()
            .removeAttr('data-format')
    }

    openFilter(columnIndex) {
        const column = this.structure.columns[columnIndex]

        this.filterController.open(column)
    }

    closeFilter() {
        this.filterController.close()
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

        if (childData.length == 0) {
            return
        }

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

        const nestedController = new TableController($table[0], nestedTable, this.options, childData, parentData)
        $table.data('table', nestedController)

        parentData.siblings.push(nestedController)

        nestedController.renderRows()
        nestedController.totals()
    }

    renderPlaceholderRows(count = null) {
        count = count || this.options.placeholderRows

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

        this.$body[0].append(...rows)
    }

    removeRow(rowId) {
        const rowIndex = this.data.findIndex(s => s.RowId == rowId)

        if (rowIndex > -1) {
            this.data.splice(rowIndex, 1)
        }

        this.parent.siblings.forEach(table => {
            table.$body.find(`tr[data-row-id="${rowId}"]`).remove()

            if (table.$body.children().length === 0) {
                table.$table.remove()
            }

            this.parent = null
        })
    }

    removeAllRows() {
        this.$body.empty()

        this.nested = { }
        this.expands = { }
    }

    showTotals() {
        this.$footer.find('span').removeClass('table-placeholder')
    }

    hideTotals() {
        const $totals = this.$footer.find('span')

        $totals.addClass('table-placeholder')
            .html('&nbsp;')
    }

    sort(columnIndex) {
        const column = this.structure.columns[columnIndex]

        this.sortController.sortColumn(column)
    }

    showDropdown(rowId) {
        if (!this.structure.hasDropdown) {
            return
        }

        const $row = this.#findRow(rowId)
        const $invoker = $row.find('[data-dropdown-invoker]')

        $(document.body).find(`[data-dropdown-id]`).remove()

        const $dropdown = this.#renderDropdown($invoker, rowId)

        $dropdown
            .appendTo(document.body)
            .find('> button').trigger('click')

    }

    getFieldAccessorByColumn(column) {
        const { field, spreadField, spreadIndex } = column

        let fieldAccessor = data => data[field]

        if (!ExecutableHelper.IsNullOrEmpty(spreadField)) {
            fieldAccessor = data => data[spreadField][spreadIndex][field]
        }

        return fieldAccessor
    }

    rerenderRow(data) {
        const {
            record,
            withChildren
        } = data

        const rowId = record.RowId
        const rowIndex = this.data.findIndex(s => s.RowId == rowId)

        const shouldRenderChildren = withChildren && this.nested[rowId]
        const shouldExpandChildren = shouldRenderChildren && this.expands[rowId]

        this.data[rowIndex] = record

        const newData = this.data[rowIndex]
        this.parent.siblings.forEach(table => {
            const $row = table.#findRow(rowId)
            const $rendered = $(ExecutableInsert.Template.render(table.structure.rowTmpl, {
                data: [ newData ]
            })).addClass('loading')

            $row.replaceWith($rendered)

            table.#updateFilterColumns($rendered)

            IncodingEngine.Current.parse($rendered)
            table.format()
            table.totals()

            if (shouldRenderChildren) {
                table.expands[rowId] = false
                table.nested[rowId] = undefined

                $rendered.next().remove()
            }
            else if (this.expands[rowId] ) {
                $rendered.find('[role=expand]').attr('data-expand', 'expanded')
            }
        })

        if (shouldExpandChildren) {
            this.expand(rowId)
        }
    }

    rerender(newData = undefined) {
        this.parent.siblings.forEach(table => {
            if (newData) {
                table.data = newData
            }

            if (!table.splitGrid) {
                table.removeAllRows()
                table.renderRows()
            }
        })

        if (this.splitGrid) {
            if (newData) {
                this.splitGrid.data = newData
            }

            this.splitGrid.rerender()
        }
    }

    invokeRecalculate(rowId) {
        const data = this.data.find(s => s.RowId == rowId)

        this.$table.trigger('recalculate', {
            ...data
        })
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
            .boundElementTo($invoker)
    }

    #findRow(rowId) {
        const selector = `tr[data-row-id="${rowId}"]:not([data-nested])`

        return this.$body.find(selector)
    }

    #renderRows(data) {
        const html = ExecutableInsert.Template.render(this.structure.rowTmpl, { data })

        const template = document.createElement('template')
        template.innerHTML = html

        const $rows = $(template.content.children)

        this.$table[0].tBodies[0].appendChild(template.content)

        if (this.options.zebra) {
            this.#renderZebra($rows)
        }

        this.#updateFilterColumns($rows)

        IncodingEngine.Current.parse($rows)
    }

    #hoverableRows() {
        let prevRowIndex = -1

        this.$body[0].addEventListener('mouseover', (ev) => {
            ev.stopPropagation()

            const $row = $(ev.target).closest('tr')
            const rowIndex = $row.index()

            const isNeedHighlight = $row.is('[body-row]')

            this.parent.siblings.forEach(table => {
                const $candidate = table.$body.children().eq(rowIndex)
                const $prev = table.$body.children().eq(prevRowIndex)

                $prev.removeClass('highlight')

                if (isNeedHighlight) {
                    $candidate.addClass('highlight')
                }
            })

            prevRowIndex = rowIndex
        })

        this.$body[0].addEventListener('mouseleave', (ev) => {
            ev.stopPropagation()

            this.parent.siblings.forEach(table => {
                const $candidate = table.$body.children()
                $candidate.removeClass('highlight')
            })
        })
    }

    #renderZebra($rows) {
        $rows.each(function(index) {
            $(this).addClass(index % 2 === 0 ? 'even' : 'odd')
        })
    }

    #updateFilterColumns($rows) {
        if (!this.filterController.isApplied()) {
            $rows.find('[current-filter]').removeClass('filtered')
            return
        }

        for (const filter of this.filterController.filters) {
            const nthChildIndex = filter.column.index + 1

            const $filteredCols = $rows.find(`td:nth-child(${nthChildIndex})`)

            $filteredCols.addClass('filtered').attr('current-filter', 'true')
        }
    }
}
