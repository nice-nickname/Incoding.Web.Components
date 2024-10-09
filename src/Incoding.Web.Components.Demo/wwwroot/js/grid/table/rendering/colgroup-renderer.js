
class ColgroupRenderer {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { {[key: number]: HTMLTableColElement} }
     */
    #colsCahce

    constructor(table) {
        this.table = table
    }

    render() {
        this.#colsCahce = { }

        const colgroup = this.table.colgroup

        const cols = []
        const columns = this.table.getFlatColumns()

        for (const column of columns) {
            const col = document.createElement('col')
            col.style.width = column.width + 'px'
            col.style.minWidth = '80px'
            col.dataset.index = column.index

            cols.push(col)

            this.#colsCahce[column.index] = col
        }

        colgroup.replaceChildren(...cols)
    }

    destroy() {
        this.#colsCahce = { }
    }

    /**
     * @param { Column } column
     */
    setResizingBorder(column) {
        this.#colsCahce[column.index].classList.add('resizing-border')
    }

    /**
     * @param { Column } column
     */
    updateColumn(column) {
        this.#colsCahce[column.index].style.width = column.width + 'px'
    }

    /**
     * @param { Column } column
     */
    removeResizingBorder(column) {
        this.#colsCahce[column.index].classList.remove('resizing-border')
    }
}
