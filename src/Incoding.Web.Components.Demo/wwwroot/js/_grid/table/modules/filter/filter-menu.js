
class FilterMenu {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { ColumnModel }
     */
    column

    /**
     * @type { FilterItem[] }
     */
    #data


    /**
     * @type { HTMLElement }
     */
    #applyButton

    /**
     * @type { HTMLInputElement }
     */
    #searchInput

    /**
     * @type { HTMLElement }
     */
    #checkboxMenu

    /**
     * @type { HTMLInputElement }
     */
    #selectAllCheckBox


    constructor(splitTable, column, data) {
        this.splitTable = splitTable
        this.column = column
        this.#data = data
    }


    /**
     * @param { IPosition } position
     */
    render(position) {
        const menu = this.#createMenu()

        this.#applyButton = menu.getElementByQuery('[data-action=Apply] > a')
        this.#checkboxMenu = menu.getElementByQuery('.checkbox-menu')
        this.#selectAllCheckBox = menu.getElementByQuery('[role="select-all"]')
        this.#searchInput = menu.getElementByQuery('[role="search"]')

        this.#addEventListeners()

        menu.show(position.top, position.left)

        this.#updateApplyButton()
        this.#updateSelectAll()
    }

    destroy() {
        this.#removeEventListeners()
    }

    #addEventListeners() {
        this.#searchInput.addEventListener('keyup', this.#handleSearch)
        this.#checkboxMenu.addEventListener('change', this.#handleMenuItemClick)
        this.#selectAllCheckBox.addEventListener('change', this.#handleSelectAll)
    }

    #removeEventListeners() {
        this.#selectAllCheckBox.removeEventListener('change', this.#handleSelectAll)
        this.#checkboxMenu.removeEventListener('change', this.#handleMenuItemClick)
        this.#searchInput.removeEventListener('keyup', this.#handleSearch)
    }



    #apply() {
        const criteria = this.#collectFilter()

        this.splitTable.filter.addFilter(this.column, criteria)
    }

    #clear() {
        this.splitTable.filter.removeFilter(this.column)
    }

    /**
     * @param { InputEvent } ev
     */
    #handleSearch = (ev) => {
        const search = ev.target.value.toLowerCase()
        const isSearchEmpty = !search || search.length === 0

        const items = this.#checkboxMenu.querySelectorAll(`.${classes.dropdownItem}`)

        for (const item of items) {
            const checkbox = item.querySelector('input[type=checkbox]')

            const isVisible = isSearchEmpty || checkbox.value.toLowerCase().indexOf(search) !== -1

            if (isVisible) {
                item.classList.remove(classes.hidden)
            } else {
                item.classList.add(classes.hidden)
            }

            this.#setVisible(checkbox.dataset.index, isVisible)
        }

        this.#updateSelectAll()
        this.#updateApplyButton()
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleSelectAll = (ev) => {
        const isChecked = ev.target.checked

        const visibleCheckboxes = $(this.#checkboxMenu).find(`.${classes.dropdownItem}:not(.${classes.hidden}) input[type=checkbox]`).get()
        for (const checkbox of visibleCheckboxes) {
            checkbox.checked = isChecked

            this.#setSelected(checkbox.dataset.index, isChecked)
        }

        this.#updateApplyButton()
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleMenuItemClick = (ev) => {
        const checkbox = ev.target

        this.#setSelected(checkbox.dataset.index)

        this.#updateSelectAll()
        this.#updateApplyButton()
    }

    #updateApplyButton() {
        const button = this.#applyButton

        if (this.#data.some(s => s.selected)) {
            button.removeAttribute('disabled')
        } else {
            button.setAttribute('disabled', '')
        }
    }

    #updateSelectAll() {
        const checkbox = this.#selectAllCheckBox

        let visibleCount = 0
        let selectedCount = 0

        for (const item of this.#data) {
            visibleCount += item.visible ? 1 : 0
            selectedCount += (item.visible && item.selected) ? 1 : 0
        }

        checkbox.checked = visibleCount !== 0 && selectedCount === visibleCount
        checkbox.indeterminate = visibleCount !== 0 && selectedCount !== 0 && selectedCount < visibleCount
    }

    #createMenu() {
        return new Menu({
            items: [
                { icon: 'ci-delete', text: 'Clear', action: 'Clear' },
                { icon: '', text: 'Apply', action: 'Apply' },
                { isDivider: true },
                { template: `<div class="textbox textbox-inline filter-search">
                                 <input type="text" role="search" placeholder="Search..." />
                             </div>` },
                { template: `<div class="checkbox checkbox-alternate filter-checkbox ci-margin-t-5">
                                 <label>
                                     <input type="checkbox" role="select-all" checked="checked">
                                     <i></i><span>Select all</span>
                                 </label>
                             </div>` },
                { template: FilterMenu.renderCheckboxList(this.#data) }
            ],
            onClick: (action) => {
                switch (action) {
                    case 'Apply':
                        this.#apply()
                        return true

                    case 'Clear':
                        this.#clear()
                        return true

                    default:
                        break;
                }
            },
            clickableInside: true
        })
    }

    #collectFilter() {
        const values = this.#data
            .filter(s => s.selected)
            .map(s => s.value)

        return new Set(values)
    }

    #setSelected(index, value = undefined) {
        const item = this.#data[Number(index)]

        if (value === undefined) {
            value = !item.selected
        }

        item.selected = value
    }

    #setVisible(index, value) {
        const item = this.#data[Number(index)]

        item.visible = value
    }

    static renderCheckboxList(data) {
        return ExecutableInsert.Template.render(this.checkboxListTemplate, { data })
    }

    static checkboxListTemplate = ExecutableInsert.Template.compile(`
        <ul class="checkbox-menu">
            {{#each data}}
                <li class="${classes.dropdownItem}">
                    <div class="checkbox checkbox-alternate filter-checkbox ci-margin-t-5">
                        <label>
                            <input type="checkbox" value="{{ value }}" {{#if selected}}checked="checked"{{/if}} data-index={{ @index }}>
                            <i></i><span>{{ text }}</span>
                        </label>
                    </div>
                </li>
            {{/each}}
        </ul
    `)
}
