
class DataBinding {

    /**
     * @type { Object[] }
     */
    data;

    /**
     * @type { SplitGrid }
     */
    grid


    /**
     * @type { RenderingBehaviour }
     */
    #renderingBehaviour

    constructor(grid) {
        this.data = []
        this.grid = grid

        this.#renderingBehaviour = new ImmediateRenderingBehaviour(grid, this)
    }

    append(...data) {
        this.data.push(...data);

        this.#renderingBehaviour.handleDataChanged()
    }

    /**
     * @param { number } start
     * @param { number } end
     */
    appendRows(start, end) {
        const chunk = this.data.slice(start, end)

        this.grid.tables.forEach((table) => {
            table.renderRows(chunk)
        })

        IncodingEngine.Current.parse(this.grid.root)
    }
}
