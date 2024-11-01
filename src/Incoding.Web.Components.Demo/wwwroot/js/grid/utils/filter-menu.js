
class FilterMenu {

    /**
     * @type { Filter }
     */
    #filter

    /**
     * @type { Column }
     */
    #column

    /**
     * @type { FilterItem[] }
     */
    #data


    /**
     * @type { HTMLElement }
     */
    #applyBtn

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



    /**
     * @param { Filter } filter
     * @param { Column } column
     * @param { FilterItem[] } data
     */
    constructor(filter, column, data) {
        this.#filter = filter
        this.#column = column
        this.#data = data
    }

    render(top, left) {
        const menu = this.#createMenu()

        this.#applyBtn = menu.getElementByQuery('[data-action=Apply] > a')
        this.#checkboxMenu = menu.getElementByQuery('.checkbox-menu')
        this.#selectAllCheckBox = menu.getElementByQuery('[role="select-all"]')
        this.#searchInput = menu.getElementByQuery('[role="search"]')

        this.#addEventListeners()

        menu.show(top, left)

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

        this.#filter.filterColumn(this.#column, criteria)
    }

    #clear() {
        this.#filter.clearFilter(this.#column)
    }

    /**
     * @param { InputEvent } ev
     */
    #handleSearch = (ev) => {
        const search = ev.target.value.toLowerCase()
        const isSearchEmpty = !search || search.length === 0

        const items = this.#checkboxMenu.querySelectorAll('.dropdown-item')

        for (const item of items) {
            const checkbox = item.querySelector('input[type=checkbox]')

            const isVisible = isSearchEmpty || checkbox.value.toLowerCase().indexOf(search) !== -1

            if (isVisible) {
                item.classList.remove('hidden')
            } else {
                item.classList.add('hidden')
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

        const visibleCheckboxes = $(this.#checkboxMenu).find('input[type=checkbox]:visible').get()
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
        const button = this.#applyBtn

        if (this.#data.some(s => s.selected)) {
            button.classList.remove('disabled')
        } else {
            button.classList.add('disabled')
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
        checkbox.indeterminate = visibleCount !== 0 && selectedCount < visibleCount
    }

    #createMenu() {
        return new Menu({
            items: [
                { icon: '', text: 'Clear', action: 'Clear' },
                { icon: '', text: 'Apply', action: 'Apply' },
                { isDivider: true },
                { template: '<input type="text" role="search" />' },
                { template: `<div class="dropdown-item">
                                 <input class="form-check-input" type="checkbox" role="select-all">
                                 <label class="form-check-label">
                                     Select all
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
        return ExecutableInsert.Template.render(this.Template, { data })
    }

    static Template = ExecutableInsert.Template.compile(`
        <ul class="checkbox-menu">
            {{#each data}}
                <li class="dropdown-item">
                    <div>
                        <input class="form-check-input" type="checkbox" value="{{ value }}" {{#if selected}}checked="checked"{{/if}} data-index={{ @index }}>
                        <label class="form-check-label">
                            {{ text }}
                        </label>
                    </div>
                </li>
            {{/each}}
        </ul
    `)
}
