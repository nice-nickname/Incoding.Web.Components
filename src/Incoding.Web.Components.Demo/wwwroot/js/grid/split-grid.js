
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
     * @type { string[] }
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
     * @type { SplitTableSchema[] }
     */
    schema

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

    /**
     * @type { SplitTable[] }
     */
    tables = []


    constructor(grid) {
        this.id = grid.id
        this.width = grid.width
        this.height = grid.height
        this.emptyContent = grid.emptyContent
        this.format = grid.format
        this.infiniteScroll = grid.infiniteScroll
        this.ui = grid.ui
        this.mode = grid.mode
        this.splits = grid.splits
        this.schema = grid.tables

        if (grid.css) {
            this.css = grid.css.split(' ').filter(s => !ExecutableHelper.IsNullOrEmpty(s))
        }

        this.data = new DataSource()

        this.splitter = new Splitter(this)
    }

    render() {
        this.root = document.getElementById(this.id)
        this.root.style.width = this.width
        this.root.style.height = this.height

        this.root.classList.add('split-grid')
        this.root.classList.add(...this.css)

        this.splitter.render()

        const emptyEl = document.createElement('div')
        emptyEl.classList.add('empty', 'hidden')
        emptyEl.innerHTML = this.emptyContent

        this.root.appendChild(emptyEl)

        for (let i = 0; i < this.splitter.panelElements.length; i++) {
            const panel = this.splitter.panelElements[i];
            const schema = this.schema[i]

            const table = new SplitTable(schema)
            table.appendTo(panel)

            this.tables.push(table)
        }
    }

    destroy() {
        this.root.remove()
    }
}
