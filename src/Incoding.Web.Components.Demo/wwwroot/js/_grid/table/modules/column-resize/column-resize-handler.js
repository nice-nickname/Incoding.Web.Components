
class ColumnResizeHandler {

    /**
     * @type { SplitTable }
     */
    splitTable

    /**
     * @type { ColumnModel }
     */
    column

    #panelIndex

    #rootOffset

    #waitNextFrame

    constructor(splitTable, column, target, panelIndex) {
        this.splitTable = splitTable
        this.column = column

        this.#panelIndex = panelIndex
        this.#rootOffset = target.getBoundingClientRect().left
    }

    start = () => {
        document.body.classList.add(classes.colResizing)

        document.addEventListener('mouseup', this.stop)
        document.addEventListener('mousemove', this.resize)
        document.addEventListener('click', this.cancelClickAfterStop, true)
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
                this.splitTable.colgroupsRenderer.updateColumn(this.#panelIndex, this.column)
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
        requestAnimationFrame(() =>  document.removeEventListener('click', this.cancelClickAfterStop, true))

        if (this.#waitNextFrame) {
            cancelAnimationFrame(this.#waitNextFrame)
            this.#waitNextFrame = null
        }

        document.body.classList.remove(classes.colResizing)

        // this.splitTable.columnResize.resize(this.column.uid, this.column.width)
    }

    /**
     * @param { PointerEvent } ev
     */
    cancelClickAfterStop = (ev) => {
        ev.stopPropagation()
    }
}
