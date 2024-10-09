
class FilterMenu {

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
     * @param { Column } column
     * @param { FilterItem[] } data
     */
    constructor(column, data) {
        this.#column = column
        this.#data = data
    }

    render(top, left) {
        const menu = this.#createMenu()

        this.#applyBtn = menu.getElement('[data-action=Apply]')
        this.#checkboxMenu = menu.getElement('.checkbox-menu')
        this.#selectAllCheckBox = menu.getElement('[role="select-all"]')
        this.#searchInput = menu.getElement('[role="search"]')

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



    #handleApply = () => {
        const filterCriteria = this.#collectFilter()
    }

    #handleClear = () => {

    }

    /**
     * @param { InputEvent } ev
     */
    #handleSearch = (ev) => {
        const search = ev.target.value.toLowerCase()
        const isSearchEmpty = !search || search.length === 0

        const items = this.#checkboxMenu.querySelectorAll('.dropdown-item')

        for (const item of items) {
            const isVisible = isSearchEmpty || item.dataset.value.toLowerCase().indexOf(search) !== -1

            if (isVisible) {
                item.classList.remove('hidden')
            } else {
                item.classList.add('hidden')
            }
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
        }

        this.#updateApplyButton()
    }

    /**
     * @param { PointerEvent} ev
     */
    #handleMenuItemClick = (ev) => {
        this.#updateSelectAll()
        this.#updateApplyButton()
    }

    #updateApplyButton() {
        const isDisabled = $(this.#checkboxMenu).find('input:checked:visible').length === 0

        if (isDisabled) {
            this.#applyBtn.classList.add('disabled')
        } else {
            this.#applyBtn.classList.remove('disabled')
        }
    }

    #updateSelectAll() {
        const visibleCheckboxes = $(this.#checkboxMenu).find('input[type=checkbox]:visible').get()

        let checkedCount = 0
        for (const checkbox of visibleCheckboxes) {
            if (checkbox.checked) {
                checkedCount++
            }
        }

        this.#selectAllCheckBox.checked = checkedCount === visibleCheckboxes.length && visibleCheckboxes.length !== 0
    }

    #collectFilter() {
        const checkboxes = $(this.#checkboxMenu).find('input[type=checkbox]').get()

        const values = []
        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                values.push(checkbox.value)
            }
        }

        return values
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
                        this.#handleApply()
                        break;

                    case 'Clear':
                        this.#handleClear()
                        break;

                    default:
                        break;
                }
            },
            closeOnItemClick: false
        })
    }

    static renderCheckboxList(data) {
        return ExecutableInsert.Template.render(this.Template, { data })
    }

    static Template = ExecutableInsert.Template.compile(`
        <ul class="checkbox-menu">
            {{#each data}}
                <li class="dropdown-item" data-value="{{ value }}">
                    <div>
                        <input class="form-check-input" type="checkbox" value="{{ value }}" {{#if selected}}checked="checked"{{/if}}>
                        <label class="form-check-label">
                            {{ text }}
                        </label>
                    </div>
                </li>
            {{/each}}
        </ul
    `)
}
