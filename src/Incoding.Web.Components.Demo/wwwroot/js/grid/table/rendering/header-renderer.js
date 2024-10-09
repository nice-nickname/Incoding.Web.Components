
class TableHeaderRenderer {

    /**
     * @type { SplitTable }
     */
    table

    /**
     * @type { number }
     */
    maxRowSpan

    /**
     * @type { boolean }
     */
    hasStacked

    constructor(table) {
        this.table = table
    }

    render() {
        const thead = this.table.thead
        const trs = []
        const columns = this.table.columns

        this.hasStacked = columns.some(c => c.stacked.length !== 0)
        this.maxRowSpan = this.hasStacked ? 2 : 1

        trs.push(this.#renderRow(columns))

        if (this.hasStacked) {
            const stacked = columns.filter(s => s.stacked.length)
                                   .flatMap(s => s.stacked)

            trs.push(this.#renderRow(stacked))
        }

        thead.replaceChildren(...trs)
    }

    destroy() {

    }


    /**
     * @param { Column[] } columns
     */
    #renderRow(columns) {
        const tr = document.createElement('tr')

        const ths = []
        for (const column of columns) {
            const isStacked = column.stacked.length !== 0

            const colspan = isStacked ? column.stacked.length : 1
            const rowspan = isStacked ? 1 : this.maxRowSpan

            const th = this.#createCell(column, colspan, rowspan)

            ths.push(th)
        }

        const pinnedColumnsLength = columns.filter(s => s.isPinned).length

        if (pinnedColumnsLength !== 0) {
            let pinOffset = 0
            for (let i = 0; i < pinnedColumnsLength; i++) {
                const column = columns[i];
                const th = ths[i]

                th.style.left = pinOffset + 'px'
                pinOffset += column.width

                if (i === pinnedColumnsLength - 1) {
                    th.classList.add('pinned-last')
                }
            }
        }

        tr.append(...ths)
        return tr
    }

    /**
     * @param { Column } column
     */
    #createCell(column, colSpan, rowSpan) {
        const th = document.createElement('th')
        th.colSpan = colSpan
        th.rowSpan = rowSpan
        th.dataset.index = column.index
        th.dataset.uid = column.uid

        th.innerHTML = column.title

        if (column.showMenu) {
            th.classList.add('menu')
            this.#appendMenuButton(th)
        }

        if (column.sortable) {
            th.classList.add('sortable')
            this.#appendSortButton(th)
        }

        if (column.resizable) {
            th.classList.add('resizable')
            this.#appendResizeButton(th)
        }

        if (column.isPinned) {
            th.classList.add('pinned')
        }

        return th
    }

    /**
     * @param { HTMLTableCellElement } th
     */
    #appendSortButton(th) {
        const sortBtn = document.createElement('div')
        sortBtn.role = roles.sort
        th.insertAdjacentElement('afterbegin', sortBtn)
    }

    /**
     * @param { HTMLTableCellElement } th
     */
    #appendMenuButton(th) {
        const menuBtn = document.createElement('button')
        menuBtn.role = roles.menu
        th.insertAdjacentElement('beforeend', menuBtn)
    }

    /**
     * @param { HTMLTableCellElement } th
     */
    #appendResizeButton(th) {
        const resizeBtn = document.createElement('div')
        resizeBtn.role = roles.resize
        th.insertAdjacentElement('beforeend', resizeBtn)
    }
}
