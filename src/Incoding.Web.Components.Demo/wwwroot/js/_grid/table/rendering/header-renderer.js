class HeaderCellComponent {

    /**
     * @type { ColumnModel }
     */
    column

    /**
     * @type { HTMLTableCellElement }
     */
    element

    /**
     * @type { HeaderCellComponent[]  }
     */
    stackedCells

    constructor(column) {
        this.column = column
        this.stackedCells = []

        this.element = document.createElement('th')
        this.refresh()
    }

    refresh() {
        const column = this.column

        const container = document.createElement('div')

        if (column.title) {
            const textSpan = document.createElement('span')
            textSpan.innerText = column.title

            container.append(textSpan)
        }

        if (column.sortable) {
            const sortButton = document.createElement('div')
            sortButton.role = roles.sort

            container.append(sortButton)
        }

        if (column.showMenu) {
            const menuButton = document.createElement('button')
            menuButton.role = roles.menu

            container.append(menuButton)
        }

        if (column.resizable) {
            const resizeBtn = document.createElement('div')
            resizeBtn.role = roles.resize

            container.append(resizeBtn)
        }

        this.element.replaceChildren(container)
    }

    destroy() {
        this.element.remove()
    }
}

class TableHeaderRenderer {

    /**
     * @type { SplitTablePanel }
     */
    parent


    /** @type { HTMLElement } */
    container

    /** @type { HTMLElement } */
    thead

    /**
     * @type { HeaderCellComponent[][] }
     */
    #cells = []

    constructor(parent) {
        this.parent = parent;

        this.container = document.createElement('div')
        this.container.classList.add('split-table-header')

        const table = document.createElement('table')
        table.classList.add(classes.splitTable)
        table.classList.add(...this.parent.model.css)

        this.thead = document.createElement('thead')

        table.append(this.thead)
        this.container.append(table)
    }

    render() {
        const columns = this.parent.getColumns()

        this.#createCells(columns)

        this.#cells.forEach(row => {
            const tr = document.createElement('tr')

            row.forEach(cell => {
                tr.append(cell.element)
            })

            this.thead.append(tr)
        })

        this.parent.rootElement.append(this.container)
    }



    /**
     * @param { ColumnModel[] } columns
     * @param { number } level
     * @param { HeaderCellComponent } parent
     */
    #createCells(columns, level = 0, parent = null) {
        if (!this.#cells[level]) {
            this.#cells[level] = []
        }

        columns.forEach(column => {
            const cell = new HeaderCellComponent(column)

            if (parent !== null) {
                parent.stackedCells.push(cell)
            }

            this.#cells[level].push(cell)

            if (column.isStacked()) {
                this.#createCells(column.stacked, level + 1, cell)
            }
        })
    }


    destroy() {
        this.container.remove()
    }

}
