
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

        const nextFilters = [...this.#getPreviousFilters(column), ...this.#getNextFilters(column)]

        const filtered = this.#filterData(this.table.originData, this.table.structure, filterColumn, nextFilters)

        this.table.rerender(filtered)
        this.table.$header.find(`[data-index=${column.index}]`).find('[role=filter]').addClass('active')
        this.close()
    }

    reset(column) {
        const resetIndex = this.filters.findIndex(s => s.column === column)
        if (resetIndex < 0) {
            return
        }

        this.filters.splice(resetIndex, 1)

        this.table.$header.find(`[data-index=${column.index}]`).find('[role=filter]').removeClass('active')

        if (this.filters.length !== 0) {
            return this.apply(this.filters[0].column, this.filters[0].criteria)
        }

        this.table.rerender(this.table.originData)
        this.close()
    }

    resetAll() {
        this.table.parent.siblings.forEach(table => {
            table.filterController.filters = []
        })

        this.table.rerender(this.table.originData)
        this.close()
    }

    #filterData(data, structure, filterColumn, nextFilters) {
        if (!data || data.length === 0) return []

        return data.filter(item => {
            const value = filterColumn.getter(item)
            let isVisible = filterColumn.criteria.has(String(value))

            if (isVisible && nextFilters.length !== 0) {
                isVisible = nextFilters.some(s => s.criteria.has(String(s.getter(item))))
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
        const $itemsContainer = $filter.find('[role=filter-items]')
        const $clear = $filter.find('[role=filter-clear]')
        const $clearAll = $filter.find('[role=filter-clear-all]')


        const $selectAll = $filter.find('[role=filter-select-all]')
        const $search = $filter.find('[role=filter-search]')

        $menu.on('click', ev => {
            ev.stopPropagation()
        })

        $search.on('keyup', function () {
            const search = $(this).val().toLowerCase()
            const isSearchEmpty = !search || search.length === 0

            $itemsContainer.find('.item').each(function () {
                const isVisible = isSearchEmpty || $(this).attr('value').toLowerCase().indexOf(search) !== -1

                if (isVisible) {
                    $(this).removeClass('hidden')
                }
                else {
                    $(this).addClass('hidden')
                }
            })

            $selectAll.trigger('update')
        })

        $selectAll.on('change', function () {
            const isChecked = $(this).prop('checked')

            console.log('asd', isChecked);

            $itemsContainer.find('.item:not(.hidden) input[type=checkbox]').each(function () {
                $(this).prop('checked', isChecked)
            })

            $itemsContainer.find('.item.hidden input[type=checkbox]').each(function () {
                $(this).prop('checked', false)
            })

            $itemsContainer.trigger('change')
            $selectAll.trigger('update')
        })

        $itemsContainer.on('change', function (event) {
            const selectedCount = $(this).find('input[type=checkbox]:checked').length

            if (selectedCount === 0) {
                $apply.find('a').attr('disabled', 'disabled')
                $selectAll.prop('checked', false)
            } else {
                $apply.find('a').removeAttr('disabled')
                $selectAll.prop('checked', true)
            }
        })

        $apply.on('click', () => {
            const criteria = FilterController.collectCriteria($itemsContainer)

            if (criteria.size === 0)
                return

            this.apply(column, criteria)
            this.close()
        })

        $clear.on('click', () => {
            this.reset(column)
            this.close()
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

    /**
     *
     * @param { Column } column
     * @returns
     */
    #collectValues(column) {
        const values = new Set()
        const getter = this.table.getFieldAccessorByColumn(column)

        const applied = this.#getPreviousFilters(column)
        const currentFilter = this.#getCurrentFilter(column)

        this.#collectValuesFromData(values, this.table.originData, getter, this.table.structure, applied, column)

        return [...values].map(val => {
            const isFiltered = !currentFilter || currentFilter.criteria.size == 0 || currentFilter.criteria.has(val)

            let text = val
            if (text == 'null' || text == 'undefined') {
                text = '(Blank)'
            }

            return { Value: val, Text: text, Visible: isFiltered }
        })
    }

    #collectValuesFromData(values, data, getter, structure, prevFilters, column) {
        data.forEach(item => {
            let val = getter(item)

            if (prevFilters.length !== 0 && !prevFilters.some(s => s.criteria.has(String(s.getter(item))))) {
                return null
            }

            if (val == null && column.type === 'Numeric')
                val = 0

            values.add(String(val))
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

        $($menu).find('input[type=checkbox]:checked').each(function () {
            criteria.add($(this).val())
        })

        return criteria
    }

    static renderMenu(data) {
        const html = ExecutableInsert.Template.render(this.Template, { data })

        return $(html)
    }

    static Template = ExecutableInsert.Template.compile(`
<div class="dropdown dropdown-alternate" role="filter-dropdown">
    <button class="hidden" type="button" data-toggle="dropdown" aria-expanded="false"></button>

    <ul class="dropdown-menu table-filter" role='filter-menu'>
        <li class="item" role='filter-clear'>
            <a href="javascript:void(0)">
                <i class="ci-size-16 ci-planifi ci-delete"></i>
                <span role="text" >Clear</span>
            </a>
        </li>

        <li class="item" role='filter-apply'>
            <a href="javascript:void(0)">
                <i class="ci-size-16 ci-planifi ci-filter"></i>
                <span role="text" >Apply</span>
            </a>
        </li>

        <li role="separator" class="divider" style="margin-bottom: 5px !important;" name=""></li>

        <li class="item ci-margin-y-5">
            <div>
                <div class="textbox textbox-inline filter-search">
                    <input type="text" placeholder="Search..." role="filter-search"/>
                </div>
            </div>
        </li>

        <li class="item filter-item">
            <div class="checkbox checkbox-alternate">
                <label>
                    <input type="checkbox" role='filter-select-all' checked />
                    <i></i><span style="width: auto;">Select all</span>
                </label>
            </div>
        </li>

        <ul class="table-filter-items" role='filter-items' click="event.stopPropagation()">
                {{#each data}}
                    <li class="item filter-item" value="{{Value}}">
                        <div class="checkbox checkbox-alternate">
                            <label>
                                <input type="checkbox" value="{{Value}}" {{#if Visible}}checked="checked"{{/if}} {{#if Disabled}}disabled="disabled"{{/if}}/>
                                <i></i><span style="width: auto;">{{Text}}</span>
                            </label>
                        </div>
                    </li>
                {{/each}}
            </ul
        </ul>
</div>`)
}
