
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


    constructor(grid) {
        this.id = grid.id
        this.format = grid.format
        this.infiniteScroll = grid.infiniteScroll
        this.ui = grid.ui
        this.mode = grid.mode
        this.splits = grid.splits
        this.schema = grid.tables.map(t => new TableSchema(t))
        this.#prepareSchema()

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
            const renderer = new InfitniteScrollRenderingBehaviour(this, binding)
            binding.setRenderer(renderer)
        } else {
            const renderer = new ImmediateRenderingBehaviour(binding)
            binding.setRenderer(renderer)
        }

        for (let i = 0; i < this.splits.length; i++) {
            const panel = this.splitter.getPanel(i)
            const schema = this.schema[i]

            const table = new SplitTable(schema, this.format, binding)
            table.appendTo(panel)

            binding.addTable(table)
        }

        this.rootBinding = binding

        $(this.root).data('splitGrid', this)
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
        this.root.setAttribute('role', 'grid')

        this.root.style.width = grid.width
        this.root.style.height = grid.height

        this.root.classList.add('split-grid')
        this.root.classList.add(...SplitGridHelpers.parseCss(grid.css))
    }


    #prepareSchema() {
        for (let i = 0; i < this.schema.length; i++) {
            const table = this.schema[i];

            if (i == 0) {
                this.#prepareTable(table)
            }
        }
    }

    /**
     * @param { TableSchema } table
     */
    #prepareTable(table) {
        if (table.row.dropdownTmpl) {
            const dropdownCol = Column.specialColumn(SpecialColumnKind.Dropdown)
            table.columns = [dropdownCol, ...table.columns]
        }

        if (table.nested) {
            const expandCol = Column.specialColumn(SpecialColumnKind.Expand)
            table.columns = [expandCol, ...table.columns]

            this.#prepareTable(table.nested)
        }
    }
}
