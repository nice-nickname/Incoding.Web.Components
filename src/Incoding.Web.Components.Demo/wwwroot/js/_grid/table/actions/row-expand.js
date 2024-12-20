

class RowExpand {

    /**
     * @type { SplitTable }
     */
    splitTable

    constructor(splitTable) {
        this.splitTable = splitTable

        this.splitTable.addManagedEventListener("body", "click", this.#handleClick)
    }

    destroy() { }

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
     * @param { HTMLElement } button
     */
    #toggleExpandCollapse(button) {
        const tr = button.closest("tr")
        const rowIndex = tr.dataset.rowIndex

        if (button.classList.contains(classes.collapsed)) {
            this.splitTable.renderNested(rowIndex)

            button.classList.remove(classes.collapsed)
            button.classList.add(classes.expanded)
        } else {
            this.splitTable.removeNested(rowIndex)

            button.classList.remove(classes.expanded)
            button.classList.add(classes.collapsed)
        }
    }
}
