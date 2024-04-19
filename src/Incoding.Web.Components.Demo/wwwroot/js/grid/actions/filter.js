
class FilterController {

    /**
     * @type { TableController }
     */
    table

    /**
     * @type { Column }
     */
    filteredColumn = null

    constructor(table) {
        this.table = table
    }

    isApplied() {
        return this.filteredColumn != null
    }

    /**
     * @param { Column } column
     */
    open(column) {
        if (this.filteredColumn == column)
            return

        this.filteredColumn = column

        const $button = this.table.$header.find(`[data-index=${column.index}]`)

        const values = this.#collectValues()
        const $filter = this.#createFilter(values)

        $filter.boundElementTo($button)
    }

    close() {
        $('[role=filter-dropdown]').remove()
        this.filteredColumn = null
    }

    enable() {
        this.table.$header.find('[role=filter]').removeClass('disabled')
    }

    disable() {
        this.table.$header.find('[role=filter]').addClass('disabled')
    }

    apply(criteria) {
        const getter = this.table.getFieldAccessorByColumn(this.filteredColumn)

        const filtered = this.#filterData(this.table.data, getter, criteria, this.table.structure)

        if (this.table.splitGrid) {
            this.table.splitGrid.originData = this.table.splitGrid.data
        }

        this.table.parent.siblings.forEach(table => {
            table.originData = table.data
            table.data = filtered
            table.removeAllRows()

            if (!table.splitGrid) {
                table.renderRows()
            }
        })

        if (this.table.splitGrid) {
            this.table.splitGrid.rerender()
            this.table.splitGrid.data = filtered
        }
    }

    #createFilter(values) {
        const $filter = FilterController.renderMenu(values)

        const $menu = $filter.find('[role=filter-menu]')
        const $apply = $filter.find('[role=filter-apply]')

        $apply.on('click', (ev) => {
            ev.stopPropagation()
            const criteria = FilterController.collectCriteria($menu)

            if (criteria.size !== 0) {
                this.apply(criteria)
            }

            this.close()
        })

        return $filter

    }

    #filterData(data, getter, criteria, structure) {
        return data.filter(item => {
            const value = getter(item)

            const isVisible = criteria.has(String(value))

            if (isVisible && structure.nested) {
                const nestedData = item[structure.nestedField]

                item[structure.nestedField] = this.#filterData(nestedData, getter, criteria, structure.nested)
            }

            return isVisible
        })
    }

    #collectValues() {
        const getter = this.table.getFieldAccessorByColumn(this.filteredColumn)

        const values = new Set()

        this.#collectValuesFromData(values, this.table.data, getter, this.table.structure)

        return [...values].map(val => {
            return { Value: val, Text: val }
        })
    }

    #collectValuesFromData(collectorDest, data, getter, structure) {
        data.forEach(item => {
            const val = getter(item)

            collectorDest.add(val)

            if (this.table.isSimpleMode() && structure.nested && item[structure.nestedField]) {
                this.#collectValuesFromData(collectorDest, item[structure.nestedField], getter, structure.nested)
            }
        })
    }

    /**
     * @param { JQuery<HTMLElement> } $menu
     */
    static collectCriteria($menu) {
        const criteria = new Set()

        $menu.find('input[type=checkbox]:checked').each(function() {
            criteria.add($(this).val())
        })

        return criteria
    }

    static renderMenu(data) {
        return $(ExecutableInsert.Template.render(this.Template, { data }))
    }

    static Template = ExecutableInsert.Template.compile(`
    <div class="dropdown" role="filter-dropdown">
        <button id="regular-dropdown" class="hidden" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu show" role='filter-menu'>
            <li class="dropdown-item">
                <a href="javascript:void(0)">
                    <button role='filter-apply'>Apply</button>
                </a>
            </li>

            {{#each data}}
                <li class="dropdown-item">
                    <a href="javascript:void(0)">
                        <div class="checkbox">
                            <input type="checkbox" value="{{Value}}" />
                            <label>{{Text}}</label>
                        </div>
                    </a>
                </li>
            {{/each}}
        </ul>
    </div>`)
}
