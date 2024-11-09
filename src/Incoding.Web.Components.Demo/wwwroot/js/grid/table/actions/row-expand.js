
class RowExpand {

    /**
     * @type { SplitTable }
     */
    #table

    constructor(table) {
        this.#table = table

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()
    }

    #addEventListeners() {
        this.#table.tbody.addEventListener('click', this.#handleClick)
    }

    #removeEventListeners() {
        this.#table.tbody.removeEventListener('click', this.#handleClick)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        const target = ev.target

        if (target.role === roles.expand) {
            ev.stopPropagation()
            this.#toggleExpandCollapse(target)
        }
    }

    /**
     * @param { HTMLElement } target
     */
    #toggleExpandCollapse(target) {
        const row = target.closest('tr')
        const rowIndex = Number(row.dataset.index)

        const dataBinding = this.#table.dataBinding

        if (target.classList.contains(classes.collapsed)) {
            dataBinding.renderNested(rowIndex)

            target.classList.remove(classes.collapsed)
            target.classList.add(classes.expanded)
        } else {
            dataBinding.removeNested(rowIndex)

            target.classList.remove(classes.expanded)
            target.classList.add(classes.collapsed)
        }
    }
}
