
class SplitGrid {

    /**
     * @type { string }
     */
    id

    /**
     * @type { string }
     */
    width

    /**
     * @type { string }
     */
    height

    /**
     * @type { string }
     */
    css

    /**
     * @type { string }
     */
    emptyContent

    /**
     * @type { FormatOptions }
     */
    format

    /**
     * @type { InfitniteScrollOptions | null }
     */
    infiniteScroll

    /**
     * @type { GridUIOptions }
     */
    ui

    /**
     * @type { GridMode }
     */
    mode

    /**
     * @type { SplitPanel[] }
     */
    splits

    /**
     * @type { SplitTable[] }
     */
    tables

    /**
     * @type { HTMLDivElement }
     */
    root


    /**
     * @type { DataSource }
     */
    data


    /**
     * @type { Splitter }
     */
    splitter


    constructor(grid) {
        this.id = grid.id
        this.width = grid.width
        this.height = grid.height
        this.css = grid.css
        this.emptyContent = grid.emptyContent
        this.format = grid.format
        this.infiniteScroll = grid.infiniteScroll
        this.ui = grid.ui
        this.mode = grid.mode
        this.splits = grid.splits
        this.tables = grid.tables

        this.data = new DataSource()

        this.splitter = new Splitter(this)
    }

    render() {
        this.root = document.getElementById(this.id)

        this.mode === GridMode.Stacked
    }

    destroy() {
        this.root.remove()
    }
}
