
class Hover {

    /**
     * @type { SplitTable }
     */
    table


    /**
     * @type { SplitTable[] }
     */
    #tables

    constructor(table) {
        this.table = table
        this.#tables = table.dataBinding.getTables()

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()
        this.#tables = null
    }

    #addEventListeners() {
        this.table.tbody.addEventListener('mouseover', this.#handleMouseOver)
        this.table.tbody.addEventListener('mouseleave', this.#handleMouseLeave)
    }

    #removeEventListeners() {
        this.table.tbody.removeEventListener('mouseleave', this.#handleMouseLeave)
        this.table.tbody.removeEventListener('mouseover', this.#handleMouseOver)
    }

    #prevRowIndex = null

    /**
     * @param { PointerEvent } ev
     */
    #handleMouseOver = (ev) => {
        ev.stopPropagation()

        const targetTr = ev.target.closest('tr')
        const rowIndex = Number(targetTr.dataset.index)
        const isNeedHighlight = targetTr.role === 'row'

        const tables = this.table.dataBinding.getTables()

        for (const table of tables) {
            const currentTr = table.getRow(rowIndex)
            const prevTr = table.getRow(this.#prevRowIndex)

            if (prevTr) {
                prevTr.classList.remove('highlight')
            }

            if (isNeedHighlight) {
                currentTr.classList.add('highlight')
            }
        }

        this.#prevRowIndex = rowIndex
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleMouseLeave = (ev) => {
        ev.stopPropagation()

        const tables = this.table.dataBinding.getTables()

        for (const table of tables) {
            const prevRow = table.getRow(this.#prevRowIndex)

            if (prevRow) {
                prevRow.classList.remove('highlight')
            }
        }
    }
}
