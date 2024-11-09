
class TableFooterRenderer {

    /**
     * @type { SplitTable }
     */
    table

    constructor(table) {
        this.table = table
    }

    render() {
        const tfoot = this.table.tfoot
        const columns = this.table.getFlatColumns()

        const tr = document.createElement('tr')

        const tds = []

        for (const column of columns) {
            const td = document.createElement('td')
            td.innerHTML = '&nbsp;'

            if (column.isPinned) {
                td.classList.add('pinned')
            }

            tds.push(td)
        }

        const pinnedColumnsLength = columns.filter(s => s.isPinned).length

        if (pinnedColumnsLength !== 0) {
            let pinOffset = 0
            for (let i = 0; i < pinnedColumnsLength; i++) {
                const column = columns[i];
                const td = tds[i]

                td.style.left = pinOffset + 'px'
                pinOffset += column.width

                if (i === pinnedColumnsLength - 1) {
                    td.classList.add('pinned-last')
                }
            }
        }

        tr.append(...tds)
        tfoot.replaceChildren(tr)
        this.update()
    }

    update() {
        const tds = this.table.tfoot.querySelectorAll('td')
        const columns = this.table.getFlatColumns()

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];

            if (!column.totalable) {
                continue
            }

            const td = tds.item(i)
            const span = document.createElement('span')

            const totalValue = this.#calculateTotal(column)
            column.formatElement(totalValue, span)

            td.replaceChildren(span)
        }
    }

    setLoading() {
        const cells = this.table.tfoot.querySelectorAll('span')

        for (const cell of cells) {
            cell.classList.add('table-placeholder')
        }
    }

    /**
     * @param { Column } column
     */
    #calculateTotal(column) {
        const data = this.table.getData()
        const field = column.spreadField ? `${column.spreadField}.${column.spreadIndex}.${column.field}` : column.field

        return DataUtil.aggregate(data, field, 'sum')
    }
}

// class FooterRenderer {

//     /**
//      * @type { SplitTable }
//      */
//     #parent

//     /**
//      * @type { HTMLDivElement }
//      */
//     #panel

//     /**
//      * @type { HTMLTableElement }
//      */
//     #table

//     constructor(table) {
//         this.#parent = table
//     }

//     render() {
//         const panel = document.createElement('div')
//         panel.classList.add('table-footer')

//         const table = document.createElement('table')
//         table.classList.add('split-table')
//         table.classList.add(...this.#parent.schema.css)
//         table.id = this.#parent.schema.id + '-footer'
//         table.innerHTML = '<tfoot>'

//         panel.appendChild(table)

//         this.#panel = panel
//         this.#table = table
//     }

//     refresh() {
//         const tfoot = document.createElement('tfoot')
//         const tr = document.createElement('tr')

//         const data = this.#parent.getData()

//         const columns = this.#parent.getFlatColumns()
//         for (const column of columns) {
//             const td = document.createElement('td')
//             td.classList.add(...column.css)

//             const contentEl = document.createElement('span')
//             if (column.totalable) {
//                 const value = this.#calculateTotal(data, column)
//                 column.formatElement(value, contentEl)
//             } else {
//                 contentEl.innerHTML = '&nbsp;'
//             }

//             td.appendChild(contentEl)
//             tr.appendChild(td)
//         }
//         tfoot.appendChild(tr)

//         const oldTfoor = this.#table.querySelector('tfoot')
//         oldTfoor.replaceWith(tfoot)
//     }

//     setLoading() {
//         const cells = this.#table.querySelectorAll('td > span')
//         cells.forEach(cell => cell.classList.add(classes.loadingPlaceholder))
//     }

//     removeLoading() {
//         const cells = this.#table.querySelectorAll('td > span')
//         cells.forEach(cell => cell.classList.remove(classes.loadingPlaceholder))
//     }

//     /**
//      * @param { object[] } data
//      * @param { Column } column
//      */
//     #calculateTotal(data, column) {
//         return DataUtil.aggregate(data, column.getField(), 'sum')
//     }
// }
