
class SplitGrid {

    /**
     * @type { string }
     */
    id

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
     * @type { SplitPanelModel[] }
     */
    splits

    /**
     * @type { TableSchema[] }
     */
    schema

    /**
     * @type { HTMLDivElement }
     */
    root


    /**
     * @type { DataBinding }
     */
    dataBinding


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
        this.emptyContent = grid.emptyContent
        this.format = grid.format
        this.infiniteScroll = grid.infiniteScroll
        this.ui = grid.ui
        this.mode = grid.mode
        this.splits = grid.splits
        this.schema = grid.tables.map(t => new TableSchema(t))

        this.root = document.getElementById(this.id)
        this.#initializeRootTag(grid)

        this.splitter = new Splitter(this)
        this.splitter.render()

        this.dataBinding = new DataBinding(this)

        const emptyEl = document.createElement('div')
        emptyEl.classList.add('empty', 'hidden')
        emptyEl.innerHTML = grid.emptyContent

        this.root.appendChild(emptyEl)
    }

    render() {
        for (let i = 0; i < this.splitter.panelElements.length; i++) {
            const panel = this.splitter.panelElements[i];
            const schema = this.schema[i]

            const table = new SplitTable(schema, this.format)
            table.appendTo(panel)

            this.tables.push(table)
        }

        $(this.root).data('splitGrid', this)
        $(this.root).trigger('grid-data-source-init')
    }

    appendData(data) {
        if (_.isString(data)) {
            data = _.unescape(data)

            data = JSON.parse(data || "[]")
        }

        this.dataBinding.append(...data)
    }

    destroy() {
        this.splitter.destroy()
        this.root.remove()
    }

    #initializeRootTag(grid) {
        this.root.setAttribute('role', 'grid')

        this.root.style.width = grid.width
        this.root.style.height = grid.height

        this.root.classList.add('split-grid')
        this.root.classList.add(...SplitGridHelpers.parseCss(grid.css))
    }
}
