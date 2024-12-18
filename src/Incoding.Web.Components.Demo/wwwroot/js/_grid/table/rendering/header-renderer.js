
class TableHeaderRenderer extends TablePanelRendererBase {

    /**
     * @type { HTMLElement[] }
     */
    theads

    constructor(parent) {
        super(parent);
        this.theads = []
    }

    /**
     * @param { HTMLElement[] } panelsContainers
     */
    renderPanels(panelsContainers) {
        super.renderPanels(panelsContainers, 'split-table-header', 'thead', 'theads')
    }

    render() {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            this.refreshPanel(i)
        }
    }

    refreshPanel(index) {
        const panelModel = this.parent.schemaModel[index]
        const thead = this.theads[index]

        const cells = this.#createCells([], panelModel.columns)

        const trs = cells.map((row) => {
            const tr = document.createElement('tr')

            row.forEach((cell) => {
                tr.append(cell.element)
            })

            return tr
        })

        thead.replaceChildren(...trs)
    }

    /**
     * @param { HeaderCellComponent[][] } cells
     * @param { ColumnModel[] } columns
     * @param { number } level
     */
    #createCells(cells, columns, level = 0) {
        if (!cells[level]) {
            cells[level] = []
        }

        columns.forEach(column => {
            const cell = new HeaderCellComponent(column)

            cells[level].push(cell)

            if (column.isStacked()) {
                this.#createCells(cells, column.stacked, level + 1)
            }
        })

        return cells
    }

    destroy() {
        for (const thead of this.theads) {
            thead.innerHTML = ''
        }
    }

}

// class TableHeaderRenderer {
//
//     /**
//      * @type { SplitTable }
//      */
//     parent
//
//
//     /** @type { HTMLElement } */
//     container
//
//     /** @type { HTMLElement } */
//     thead
//
//     /**
//      * @type { HeaderCellComponent[][] }
//      */
//     #cells = []
//
//     constructor(parent) {
//         this.parent = parent;
//
//         this.container = document.createElement('div')
//         this.container.classList.add('split-table-header')
//
//         const table = document.createElement('table')
//         table.classList.add(classes.splitTable)
//         table.classList.add(...this.parent.model.css)
//
//         this.thead = document.createElement('thead')
//
//         table.append(this.thead)
//         this.container.append(table)
//     }
//
//     render() {
//         const columns = this.parent.getColumns()
//
//         this.#createCells(columns)
//
//         this.#cells.forEach(row => {
//             const tr = document.createElement('tr')
//
//             row.forEach(cell => {
//                 tr.append(cell.element)
//             })
//
//             this.thead.append(tr)
//         })
//
//         this.parent.rootElement.append(this.container)
//     }
//
//
//
//     /**
//      * @param { ColumnModel[] } columns
//      * @param { number } level
//      * @param { HeaderCellComponent } parent
//      */
//     #createCells(columns, level = 0, parent = null) {
//         if (!this.#cells[level]) {
//             this.#cells[level] = []
//         }
//
//         columns.forEach(column => {
//             const cell = new HeaderCellComponent(column)
//
//             if (parent !== null) {
//                 parent.stackedCells.push(cell)
//             }
//
//             this.#cells[level].push(cell)
//
//             if (column.isStacked()) {
//                 this.#createCells(column.stacked, level + 1, cell)
//             }
//         })
//     }
//
//
//     destroy() {
//         this.container.remove()
//     }
//
// }
