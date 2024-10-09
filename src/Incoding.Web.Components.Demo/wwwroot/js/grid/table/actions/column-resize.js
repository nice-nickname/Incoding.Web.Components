
class ColumnResize {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()
    }

    #addEventListeners() {
        this.table.thead.addEventListener('mousedown', this.#handleClick)
    }

    #removeEventListeners() {
        this.table.thead.removeEventListener('mousedown', this.#handleClick)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        const { target } = ev

        if (target.role !== roles.resize) {
            return
        }

        ev.stopPropagation()
        ev.preventDefault()

        const th = target.closest('th')
        const column = this.table.getColumn(th.dataset.uid)

        const handler = new ColumnResizeHandler(this.table, column, th)
        handler.start()
    }
}

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

        if (width > this.column.minWidth) {
            this.column.width = width

            this.#waitNextFrame = requestAnimationFrame(() => {
                this.table.colGroup.updateColumn(this.column)
                this.#waitNextFrame = null
            })
        }
    }

    /**
     * @param { PointerEvent} ev
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
    }
}
