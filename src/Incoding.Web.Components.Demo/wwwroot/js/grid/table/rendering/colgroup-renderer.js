
class ColgroupRenderer {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { {[key: number]: HTMLTableColElement} }
     */
    #cols

    constructor(table) {
        this.table = table
    }

    render() {
        this.#cols = { }

        const colgroup = this.table.colgroup

        const cols = []
        const columns = this.table.getFlatColumns()

        for (const column of columns) {
            const col = document.createElement('col')
            col.style.width = column.width + 'px'
            col.style.minWidth = column.minWidth + 'px'
            col.dataset.index = column.index

            cols.push(col)

            this.#cols[column.index] = col
        }

        colgroup.replaceChildren(...cols)
    }

    destroy() {
        this.#cols = { }
    }

    /**
     * @param { Column } column
     */
    setResizingBorder(column) {
        this.#cols[column.index].classList.add(classes.colResizing)
    }

    /**
     * @param { Column } column
     */
    updateColumn(column) {
        this.#cols[column.index].style.width = column.width + 'px'
    }

    /**
     * @param { Column } column
     */
    removeResizingBorder(column) {
        this.#cols[column.index].classList.remove(classes.colResizing)
    }

    /**
     * @param { Column } column
     */
    setFilterColumn(column) {
        this.#cols[column.index].classList.add(classes.colFiltered)
    }

    removeFilterColumn(column) {
        this.#cols[column.index].classList.remove(classes.colFiltered)
    }
}
