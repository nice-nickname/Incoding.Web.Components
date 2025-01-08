
class RowHover {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { number | null }
     */
    #prevRowIndex = null

    constructor(splitTable) {
        this.splitTable = splitTable

        this.splitTable.addManagedEventListener("body", "mouseover", this.#handleMouseOver)
        this.splitTable.addManagedEventListener("body", "mouseleave", this.#handleMouseLeave)
    }

    destroy() {
        this.#prevRowIndex = null
    }

    hoverRow(rowIndex) {
        if (this.#prevRowIndex !== null) {
            this.#setHoverClass(this.#prevRowIndex, false)
        }

        this.#setHoverClass(rowIndex, true)

        this.#prevRowIndex = rowIndex
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleMouseOver = (ev) => {
        if (ev.target.closest(".split-table-panel").dataset.id !== this.splitTable.id) {
            this.#hoverInNestedTable(ev)
            return
        }

        this.#hoverInCurrentTable(ev)
    }

    #hoverInCurrentTable(ev) {
        let tr = ev.target.closest("tr")

        if (tr.role !== roles.row) {
            tr = tr.previousSibling
        }
        const rowIndex = Number(tr.dataset.rowIndex)

        this.hoverRow(rowIndex)
    }

    /**
     * @param { PointerEvent } ev
     */
    #hoverInNestedTable(ev) {
        const container = ev.target.closest(`.${classes.nestedTableContainer}`)

        let tr = container.closest('tr')
        while (tr) {
            if (tr.tagName === 'TR') {
                const prevRow = tr.previousSibling
                const rowIndex = Number(prevRow.dataset.rowIndex)

                if (!prevRow.classList.contains(classes.hover)) {
                    this.hoverRow(rowIndex)
                    break;
                }
            }
            tr = tr.parentNode
        }
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleMouseLeave = (ev) => {
        ev.stopPropagation()

        this.#setHoverClass(this.#prevRowIndex, false)
    }

    #setHoverClass(rowIndex, state) {
        this.splitTable
            .getTrs(rowIndex)
            .forEach(tr => {
                if (state) {
                    tr.classList.add(classes.hover)
                } else {
                    tr.classList.remove(classes.hover)
                }
            })
    }
}
