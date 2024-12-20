
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
            } else {
              span.innerHTML = '&nbsp;'
            }

            td.append(span)
            tr.append(td)
        })

        tr.append(new DummyCellRenderer().render())

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
        let data = this.parent.dataSource.getData()

        if (this.parent.rowGroup.isGrouped()) {
            data = data.map(rowData => rowData["Group"])
        }

        const field = column.getField()

        return DataUtil.aggregate(data, field, 'sum')
    }
}
