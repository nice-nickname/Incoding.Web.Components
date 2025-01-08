
class TableFooterRenderer {

    /**
     * @type { SplitTable }
     */
    parent

    /**
     * @type { HTMLElement[] }
     */
    tfoots

    constructor(parent) {
        this.parent = parent

        this.tfoots = this.parent.contentRenderer.tables.map(table => {
            const tfoot = document.createElement("tfoot")
            tfoot.classList.add('split-table-footer')
            table.appendChild(tfoot)

            return tfoot
        })
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
            td.style.textAlign = column.alignment;

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

        tfoot.replaceChildren(tr)
    }

    setLoading() {
        for (const element of this.tfoots) {
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

        const field = column.getField()

        return DataUtil.aggregate(data, field, 'sum')
    }
}
