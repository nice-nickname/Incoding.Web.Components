
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

    /**
     * @param { PointerEvent } ev
     */
    #handleMouseOver = (ev) => {
        ev.stopPropagation()

        const tr = ev.target.closest("tr")
        const rowIndex = Number(tr.dataset.rowIndex)

        const isNeedHighlight = tr.role === roles.row

        for (const tbody of this.splitTable.contentRenderer.tbodies) {
            if (this.#prevRowIndex !== null) {
                const prevRow = tbody.querySelector(`[data-row-index="${this.#prevRowIndex}"]`)

                if (prevRow) {
                    prevRow.classList.remove(classes.hover)
                }
            }

            if (isNeedHighlight) {
                const thisRow = tbody.querySelector(`[data-row-index="${rowIndex}"]`)
                thisRow.classList.add(classes.hover)
            }
        }

        this.#prevRowIndex = rowIndex
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleMouseLeave = (ev) => {
        ev.stopPropagation()

        for (const tbody of this.splitTable.contentRenderer.tbodies) {
            const prevRow = tbody.querySelector(`[data-row-index="${this.#prevRowIndex}"]`)

            if (prevRow) {
                prevRow.classList.remove(classes.hover)
            }
        }
    }
}
