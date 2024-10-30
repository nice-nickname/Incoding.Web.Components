
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

        const row = ev.target.closest('tr')
        const rowIndex = Number(row.dataset.index)
        const isNeedHighlight = row.role === 'row'

        const tables = this.table.dataBinding.getTables()

        for (const table of tables) {
            const currentRow = table.getRow(rowIndex)
            const prevRow = table.getRow(this.#prevRowIndex)

            if (prevRow) {
                prevRow.classList.remove('highlight')
            }

            if (isNeedHighlight) {
                currentRow.classList.add('highlight')
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
