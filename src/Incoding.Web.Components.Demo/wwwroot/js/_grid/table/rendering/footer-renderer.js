
class TableFooterRenderer extends TablePanelRendererBase {

    /**
     * @type { HTMLElement[] }
     */
    tfoots

    constructor(parent) {
        super(parent);
        this.tfoots = []
    }

    /**
     * @param { HTMLElement[] } panelsContainers
     */
    renderPanels(panelsContainers) {
        super.renderPanels(panelsContainers, 'split-table-footer', 'tfoot', 'tfoots');
    }

    render() {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            this.refreshPanel(i)
        }
    }

    destroy() {
        for (const tfoot of this.tfoots) {
            tfoot.innerHTML = ''
        }
    }

    refreshPanel(index) {
        const column = this.parent.schemaModel[index].getFlatColumns()
        const tfoot = this.tfoots[index]

        const tr = document.createElement('tr')

        column.forEach((column) => {
            const td = document.createElement('td')
            const span = document.createElement('span')

            if (column.totalable) {
                const totalValue = this.#calculateTotal(column)
                column.formatElement(totalValue, span)
            }

            td.append(span)
            tr.append(td)
        })

        tfoot.replaceChildren(tr)
    }

    setLoading() {
        for (const element of this.elements) {
            element
                .querySelectorAll('td > span')
                .forEach((td) => td.classList.add(classes.loadingPlaceholder))
        }
    }

    /**
     * @param { ColumnModel } column
     */
    #calculateTotal(column) {
        const data = this.parent.dataSource.getData()

        const field = column.getField()

        return DataUtil.aggregate(data, field, 'sum')
    }
}

// class TableFooterRenderer {
//
//     /**
//      * @type { TablePanel }
//      */
//     parent
//
//     /** @type { HTMLElement } */
//     #container
//
//     /** @type { HTMLElement } */
//     #footer
//
//     constructor(parent) {
//         this.parent = parent
//
//         this.#container = document.createElement("div")
//         this.#container.classList.add('split-table-footer')
//
//         const table = document.createElement("table")
//         table.classList.add(classes.splitTable)
//         table.classList.add(...parent.model.css)
//
//         this.#footer = document.createElement("tfoot")
//
//         table.append(this.#footer)
//
//         this.#container.append(table)
//     }
//
//     render() {
//         this.parent.rootElement.append(this.#container)
//     }
//
//     #renderRow() {
//         const tr = document.createElement('tr')
//
//
//         return tr
//     }
//
//     /**
//      * @param { ColumnModel } column
//      */
//     #createFooterCell(column) {
//         const td = document.createElement('td')
//
//         return td
//     }
//
//     destroy() {
//         this.#container.remove()
//     }
//
// }
