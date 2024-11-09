
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
     * @type { HTMLElement }
     */
    empty


    /**
     * @type { DataBinding }
     */
    rootBinding

    /**
     * @type { ServiceCollection }
     */
    services


    constructor(grid) {
        this.id = grid.id
        this.infiniteScroll = grid.infiniteScroll
        this.ui = grid.ui
        this.mode = grid.mode
        this.splits = grid.splits

        this.services = new ServiceCollection()
        this.services.register(FormatService.name, new FormatService(grid.format))

        this.schema = grid.tables.map(t => new TableSchema(t, this.services, this.mode))

        this.root = document.getElementById(this.id)
        this.#initializeRootTag(grid)

        this.splitter = new Splitter(grid.splits)
        this.splitter.appendTo(this.root)

        this.empty = document.createElement('div')
        this.empty.classList.add(classes.empty, classes.hidden)
        this.empty.innerHTML = grid.emptyContent
        this.root.appendChild(this.empty)
    }

    render() {
        const binding = new DataBinding()

        if (this.infiniteScroll) {
            const scrollerEl = this.splitter.getPanel(0)

            binding.setRenderer(new InfitniteScrollRenderingBehaviour(scrollerEl, this.infiniteScroll, binding))
        } else {
            binding.setRenderer(new ImmediateRenderingBehaviour(binding))
        }

        for (let i = 0; i < this.splits.length; i++) {
            const panel = this.splitter.getPanel(i)
            const schema = this.schema[i]

            const table = new SplitTable(schema, this.services, binding, this.mode)
            table.appendTo(panel)

            binding.addTable(table)
        }

        this.rootBinding = binding

        $(this.root).data('splitGrid', this)
    }

    clearData() {
        this.rootBinding.clearData()
    }

    appendData(data) {
        if (_.isString(data)) {
            data = JSON.parse(data || "[]")
        }

        this.rootBinding.appendData(data)
    }

    show() {
        this.empty.classList.add(classes.hidden)
        this.splitter.root.classList.remove(classes.hidden)
    }

    hide() {
        this.empty.classList.remove(classes.hidden)
        this.splitter.root.classList.add(classes.hidden)
    }

    showLoader() {
        this.root.classList.add(classes.loading)
    }

    removeLoader() {
        this.root.classList.remove(classes.loading)
    }

    destroy() {
        this.splitter.destroy()
        this.root.remove()
    }

    #initializeRootTag(grid) {
        this.root.role = roles.grid

        this.root.style.width = grid.width
        this.root.style.height = grid.height

        this.root.classList.add(classes.splitGrid)
        this.root.classList.add(`split-grid-${this.mode.toLowerCase()}`)
        this.root.classList.add(classes.loader)
        this.root.classList.add(...SplitGridHelpers.parseCss(grid.css))
    }
}
