
class SplitGrid {

    /**
     * @type { string }
     */
    id

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
     * @type { Splitter }
     */
    splitter

    /**
     * @type { Empty }
     */
    empty


    /**
     * @type { DataBinding }
     */
    rootBinding

    /**
     * @type { ServiceCollection }
     */
    serviceCollection


    constructor(grid) {
        this.id = grid.id
        this.infiniteScroll = grid.infiniteScroll
        this.ui = grid.ui
        this.mode = grid.mode
        this.splits = grid.splits

        this.serviceCollection = new ServiceCollection()
        this.serviceCollection.register(FormatService.name, new FormatService(grid.format))


        this.schema = grid.tables.map(t => new TableSchema(t, this.serviceCollection, this.mode))

        this.root = document.getElementById(this.id)
        this.#initializeRootTag(grid)

        this.splitter = new Splitter(grid.splits)
        this.splitter.appendTo(this.root)

        this.empty = new Empty(grid.emptyContent)
        this.empty.appendTo(this.root)
    }

    render() {
        const binding = new DataBinding()

        if (this.infiniteScroll !== null) {
            const scrollerEl = this.splitter.getPanel(0)

            binding.setRenderer(new InfitniteScrollRenderingBehaviour(scrollerEl, this.infiniteScroll, binding))
        } else {
            binding.setRenderer(new ImmediateRenderingBehaviour(binding))
        }

        for (let i = 0; i < this.splits.length; i++) {
            const panel = this.splitter.getPanel(i)
            const schema = this.schema[i]

            const table = new SplitTable(schema, this.serviceCollection, binding, this.mode)
            table.appendTo(panel)

            binding.addTable(table)
        }

        this.rootBinding = binding

        $(this.root).data('splitGrid', this)
    }

    clearData() {
        this.rootBinding.unbind()
    }

    appendData(data) {
        if (_.isString(data)) {
            data = JSON.parse(data || "[]")
        }

        this.rootBinding.appendData(data)
    }

    destroy() {
        this.splitter.destroy()
        this.root.remove()
    }

    #initializeRootTag(grid) {
        this.root.role = roles.grid

        this.root.style.width = grid.width
        this.root.style.height = grid.height

        this.root.classList.add('split-grid')
        this.root.classList.add(`split-grid-${this.mode.toLowerCase()}`)
        this.root.classList.add(...SplitGridHelpers.parseCss(grid.css))
    }
}
