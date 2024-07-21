
class ColumnResizerController {

    /**
     * @type { TableController }
     */
    table

    constructor(table) {
        this.table = table
    }

    /**
     * @param { Column } column
     */
    startResize(column) {
        const header = this.table.$header.find(`[data-index=${column.index}]`)

        const handler = new ColumnResizerHandler(column, header, this.table)
        ColumnResizerHandler.start(handler)
    }
}

class ColumnResizerHandler {

    static minWidth = 15

    /**
     * @type { Column }
     */
    column

    /**
     * @type { JQuery<HTMLElement> }
     */
    $target

    /**
     * @type { JQuery<HTMLElement> | null }
     */
    $stackedParent

    /**
     * @type { number }
     */
    #offset

    /**
     * @type { TableController }
     */
    table

    #waitNextFrame = null

    #resizeBind

    constructor(column, cell, table) {
        this.column = column
        this.$target = $(cell)
        this.$stackedParent = null
        this.table = table

        if (this.column.parentIndex) {
            this.$stackedParent = this.$target.closest('thead').find(`[data-index=${this.column.parentIndex}]`)
        }

        this.#offset = this.$target.offset().left
    }

    start() {
        this.$target.addClass('active')
        this.$target.closest('table').addClass('resizing')

        this.#resizeBind = this.resize.bind(this)
        document.addEventListener('mousemove', this.#resizeBind)
    }

    /**
     * @param { MouseEvent } event
     */
    resize(event) {
        if (this.#waitNextFrame)
            return

        let width = Math.round(event.clientX - this.#offset)

        if (width > ColumnResizerHandler.minWidth) {
            this.#waitNextFrame = requestAnimationFrame(() => {
                this.table.colgroupController.resizeColumn(this.column.index, width)
                this.#waitNextFrame = null
            })
        }
    }

    stop() {
        document.removeEventListener('mousemove', this.#resizeBind);

        setTimeout(() => {
            this.$target.removeClass('active')
        }, 100)

        this.$target.closest('table')
            .removeClass('resizing')
            .trigger(events.resize, this.column)

        if (this.table.isSimpleMode()) {
            const nestedTables = this.table.$table.find('table')

            nestedTables.each((_, el) => {
                $(el).data('table').colgroupController.resizeColumn(
                    this.column.index,
                    this.column.width
                )
            })
        }
    }

    /**
     * @type  { ColumnResizerHandler }
     */
    static global = null

    static start(handler) {
        this.stop()

        this.global = handler
        this.global.start()
    }

    static stop() {
        if (this.global) {
            this.global.stop()
        }

        this.global = null
    }
}

document.addEventListener('mouseup', () => {
    ColumnResizerHandler.stop()
});
