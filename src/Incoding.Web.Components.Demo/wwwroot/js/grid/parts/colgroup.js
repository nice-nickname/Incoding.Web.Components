
class ColGroupController {

    /**
     * @type { Column[] }
     */
    columns

    /**
     * @type { TableController }
     */
    table

    /**
     * @type { JQuery<HTMLElement> }
     */
    $colgroup

    constructor(table) {
        this.table = table;
        this.columns = table.structure.columns

        this.$colgroup = $()

        this.update()
    }

    update() {
        this.$colgroup.remove()

        const colgroup = document.createElement('colgroup')

        for (const column of this.columns) {
            const columnEl = document.createElement('col')
            columnEl.style.width = `${column.width}px`

            columnEl.dataset.index = column.index

            colgroup.appendChild(columnEl)
        }

        this.table.$table.append(colgroup)

        this.$colgroup = $(colgroup)
    }

    resizeColumn(columnIndex, width) {
        const column = this.columns.find(s => s.index == columnIndex)
        const colEl = this.$colgroup.find(`[data-index=${columnIndex}]`)[0]

        colEl.style.width = `${width}px`
        column.width = width
    }
}
