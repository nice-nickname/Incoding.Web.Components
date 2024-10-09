
class ColumnResizeHandler {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { Column }
     */
    column

    #rootOffset
    #waitNextFrame

    constructor(table, column, target) {
        this.table = table
        this.column = column

        this.#rootOffset = target.getBoundingClientRect().left
    }

    start = () => {
        this.table.root.classList.add('resizing')
        this.table.colGroup.setResizingBorder(this.column)

        document.addEventListener('mouseup', this.stop, { passive: true })
        document.addEventListener('mousemove', this.resize, { passive: true })
    }

    /**
     * @param { PointerEvent } ev
     */
    resize = (ev) => {
        if (this.#waitNextFrame) return;

        const width = Math.round(ev.clientX - this.#rootOffset)

        if (width >= this.column.minWidth) {
            this.column.width = width

            this.#waitNextFrame = requestAnimationFrame(() => {
                this.table.colGroup.updateColumn(this.column)
                this.#waitNextFrame = null
            })
        }
    }

    /**
     * @param { PointerEvent } ev
     */
    stop = (ev) => {
        document.removeEventListener('mousemove', this.resize)
        document.removeEventListener('mouseup', this.stop)

        if (this.#waitNextFrame) {
            cancelAnimationFrame(this.#waitNextFrame)
            this.#waitNextFrame = null
        }

        this.table.colGroup.removeResizingBorder(this.column)
        this.table.root.classList.remove('resizing')

        this.table.columnResize.resize(this.column.uid, this.column.width)
        this.table.columnChanged(this.column)
    }
}
