
class TableContentRenderer extends TablePanelRendererBase {

    /**
     * @type { HTMLElement[] }
     */
    tbodies

    /**
     * @type { HTMLElement[] }
     */
    placeholders

    constructor(parent) {
        super(parent)
        this.tbodies = []
        this.placeholders = []
    }

    /**
     * @param { HTMLElement[] } panelsContainers
     */
    renderPanels(panelsContainers) {
        super.renderPanels(panelsContainers, 'split-table-content', 'tbody', 'tbodies')

        this.elements.forEach(element => {
            const placeholder = document.createElement('div')
            placeholder.classList.add('rows-placeholder')
            placeholder.innerHTML = `<span>No rows to display</span>`

            this.placeholders.push(placeholder)
            element.append(placeholder)
        })

        this.showNoRows()
    }

    renderRows(data) {
        this.hideNoRows()
        this.hideLoadingRows()

        for (let i = 0; i < this.tbodies.length; i++) {
            const panelModel = this.parent.schemaModel[i]
            const tbody = this.tbodies[i]

            for (const rowData of data) {
                const tr = this.#renderRow(panelModel, rowData)
                tbody.append(tr)
            }
        }
    }

    destroy() {
        this.removeRows()
    }

    removeRows() {
        for (const tbody of this.tbodies) {
            tbody.innerHTML = ''
        }
    }


    showNoRows() {
        for (let i = 0; i < this.elements.length; i++) {
            this.tables[i].classList.add(classes.hidden)
            this.placeholders[i].classList.remove(classes.hidden)
        }
    }

    hideNoRows() {
        for (let i = 0; i < this.elements.length; i++) {
            this.tables[i].classList.remove(classes.hidden)
            this.placeholders[i].classList.add(classes.hidden)
        }
    }


    showLoadingRows() {
        for (let i = 0; i < this.tbodies.length; i++) {
            const panelModel = this.parent.schemaModel[i]
            const tbody = this.tbodies[i]

            const trs = Array.from({ length: 3 }, () => this.#renderLoadingRow(panelModel))
            tbody.append(...trs)
        }
    }

    hideLoadingRows() {
        for (const tbody of this.tbodies) {
            tbody.querySelectorAll(`[role=${roles.temp}]`)
                .forEach((tempTr) => tempTr.remove())
        }
    }


    /**
     * @param { TablePanelModel } panelModel
     * @param { object } rowData
     */
    #renderRow(panelModel, rowData) {
        const row = panelModel.row
        const columns = panelModel.getFlatColumns()

        const cellRenderer = new CellRenderer()

        const tr = document.createElement('tr')
        tr.className = row.css
        tr.role = roles.row
        
        columns.forEach(column => {
            const td = cellRenderer.render(column, rowData)
            tr.append(td)
        })

        return tr
    }

    /**
     * @param { TablePanelModel } panelModel
     */
    #renderLoadingRow(panelModel) {
        const tr = document.createElement('tr')
        tr.role = roles.temp

        for (const column of panelModel.getFlatColumns()) {
            const td = document.createElement('td')
            td.innerHTML = '<span class="table-placeholder">&nbsp;</span>'

            tr.append(td)
        }

        return tr
    }

}

// class TableContentRenderer {
//
//     /**
//      * @type { TablePanel }
//      */
//     parent
//
//
//     /** @type { HTMLElement } */
//     #container
//
//     /** @type { HTMLElement } */
//     #body
//
//     constructor(parent) {
//         this.parent = parent;
//
//         this.#container = document.createElement("div")
//         this.#container.classList.add('split-table-content')
//
//         const table = document.createElement("table")
//         table.id = parent.model.id
//         table.classList.add(classes.splitTable)
//         table.classList.add(...parent.model.css)
//
//         this.#body = document.createElement('tbody')
//         table.append(this.#body)
//
//         this.#container.append(table)
//     }
//
//     render() {
//         this.parent.rootElement.append(this.#container)
//     }
//
//     destroy() {
//         this.#container.remove()
//     }
// }
