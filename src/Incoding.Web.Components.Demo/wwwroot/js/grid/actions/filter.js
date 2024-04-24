
class FilterController {

    /**
     * @type { TableController }
     */
    table

    /**
     * @type { FilterColumn[] }
     */
    filters

    constructor(table) {
        this.table = table
        this.filters = []
    }

    isApplied() {
        return this.filters.length
    }

    open(column) {
        this.close()

        this.#createFilter(column)
    }

    close() {
        $('[role=filter-dropdown]').remove()
    }

    enable() {
        this.table.$header.find('[role=filter]').removeClass('disabled')
    }

    disable() {
        this.table.$header.find('[role=filter]').addClass('disabled')
    }

    apply(column, criteria) {
        let filterColumn = this.#getFilterColumn(column)

        if (!filterColumn) {
            filterColumn = {
                column: column,
                getter: this.table.getFieldAccessorByColumn(column)
            }

            this.filters.push(filterColumn)
        }

        filterColumn.criteria = criteria

        const nextFilters = this.#getNextFilters(column)
        const filtered = this.#filterData(this.table.originData, this.table.structure, filterColumn, nextFilters)

        if (this.table.splitGrid) {
            this.table.splitGrid.data = filtered
        }

        this.table.parent.siblings.forEach(table => {
            table.data = filtered

            table.removeAllRows()

            if (!table.splitGrid) {
                table.renderRows()
            }
        })

        if (this.table.splitGrid) {
            this.table.splitGrid.rerender()
        }
    }

    reset(column) {
        const resetIndex = this.filters.findIndex(s => s.column === column)
        if (resetIndex < 0) {
            return
        }

        this.filters.splice(resetIndex, 1)

        if (this.filters.length !== 0) {
            return this.apply(this.filters[0].column, this.filters[0].criteria)
        }

        if (this.table.splitGrid) {
            this.table.splitGrid.data = this.table.splitGrid.originData
        }

        this.table.parent.siblings.forEach(table => {
            table.data = table.originData
        })

        this.table.parent.siblings.forEach(table => {
            table.removeAllRows()

            if (!table.splitGrid) {
                table.renderRows()
            }
        })

        if (this.table.splitGrid) {
            this.table.splitGrid.rerender()
        }
    }

    #filterData(data, structure, filterColumn, nextFilters) {
        if (!data || data.length === 0) return []

        return data.filter(item => {
            const value = filterColumn.getter(item)
            let isVisible = filterColumn.criteria.has(String(value))

            if (isVisible && nextFilters.length !== 0) {
               isVisible = nextFilters.some(s => s.criteria.has(String(s.getter(item))))
            }

            if (isVisible && this.table.isSimpleMode() && structure.nested) {
                item[structure.nested] = this.#filterData(item[structure.nested], structure.nested, filterColumn)
            }

            return isVisible
        })
    }

    #createFilter(column) {
        const values = this.#collectValues(column)

        const $button = this.table.$header.find(`[data-index=${column.index}] [role=filter]`)
        const $filter = FilterController.renderMenu(values)

        const $menu = $filter.find('[role=filter-menu]')
        const $apply = $filter.find('[role=filter-apply]')
        const $clear = $filter.find('[role=filter-clear]')

        $apply.on('click', () => {
            const criteria = FilterController.collectCriteria($menu)

            this.apply(column, criteria)
            this.close()
        })

        $clear.on('click', () => {
            this.reset(column)
        })

        $filter
            .boundElementTo($button)
            .on('shown.bs.dropdown', () => {
                requestAnimationFrame(() => {
                    $filter.find('ul').css('transform', '')
                })
            })

        $filter.find('> button').trigger('click')

    }

    #collectValues(column) {
        const values = new Set()
        const getter = this.table.getFieldAccessorByColumn(column)

        const applied = this.#getPreviousFilters(column)
        const currentFilter = this.#getCurrentFilter(column)

        this.#collectValuesFromData(values, this.table.originData, getter, this.table.structure, applied)

        return [...values].filter(s => s !== null).map(val => {
            const isFiltered = !currentFilter || currentFilter.criteria.size == 0 || currentFilter.criteria.has(val)

            return { Value: val, Text: val, Visible: isFiltered }
        })
    }

    #collectValuesFromData(values, data, getter, structure, prevFilters) {
        data.forEach(item => {
            const val = getter(item)

            if (prevFilters.length !== 0 && !prevFilters.some(s => s.criteria.has(String(s.getter(item))))) {
                return null
            }

            values.add(String(val))

            if (this.table.isSimpleMode() && structure.nested && item[structure.nestedField]) {
                this.#collectValuesFromData(values, item[structure.nestedField], getter, structure.nested)
            }
        })
    }

    #getFilterColumn(column) {
        return this.filters.find(s => s.column == column)
    }

    #getPreviousFilters(column) {
        const filterIndex = this.filters.findIndex(s => s.column == column)
        const filterColumnIndex = filterIndex >= 0 ? filterIndex : this.filters.length

        const prevFilters = this.filters.slice(0, filterColumnIndex)

        return prevFilters || []
    }

    #getNextFilters(column) {
        const filterIndex = this.filters.findIndex(s => s.column == column)
        const filterColumnIndex = filterIndex >= 0 ? filterIndex : this.filters.length

        const nextFilters = this.filters.slice(filterColumnIndex + 1)

        return nextFilters || []
    }

    #getCurrentFilter(column) {
        return this.filters.find(s => s.column == column)
    }

    static collectCriteria($menu) {
        const criteria = new Set()

        $($menu).find('input[type=checkbox]:checked').each(function() {
            criteria.add($(this).val())
        })

        return criteria
    }

    static renderMenu(data) {
        const html = ExecutableInsert.Template.render(this.Template, { data })

        return $(html)
    }

    static Template = ExecutableInsert.Template.compile(`
<div class="dropdown" role="filter-dropdown">
    <button id="regular-dropdown" class="hidden" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>

    <ul class="dropdown-menu" role='filter-menu'>
        <li class="dropdown-item">
            <a href="javascript:void(0)">
                <button role='filter-clear'>Clear</button>
            </a>
        </li>

        <li class="dropdown-item">
            <a href="javascript:void(0)">
                <button role='filter-apply'>Apply</button>
            </a>
        </li>

        {{#each data}}
            <li class="dropdown-item">
                <a href="javascript:void(0)">
                    <div class="checkbox">
                        <input type="checkbox" value="{{Value}}" {{#if Visible}}checked="checked"{{/if}} {{#if Disabled}}disabled="disabled"{{/if}} />
                        <label>{{Text}}</label>
                    </div>
                </a>
            </li>
        {{/each}}
    </ul>
</div>`)
}
