
class HeaderRenderer {

    /**
     * @type { SplitTable }
     */
    #parent

    /**
     * @type { HTMLDivElement }
     */
    #panel

    /**
     * @type { HTMLTableElement }
     */
    #table

    constructor(table) {
        this.#parent = table
    }

    render() {
        const panel = document.createElement('div')
        panel.classList.add('table-header')

        const table = document.createElement('table')
        table.classList.add('split-table')
        table.classList.add(...this.#parent.schema.css)
        table.id = this.#parent.schema + '-header'
        table.innerHTML = '<thead>'

        panel.appendChild(table)

        this.#table = table
        this.#panel = panel
    }

    refresh() {
        const thead = document.createElement('thead')

        const columns = this.#parent.columns
        for (let level = 0; level < 2; level++) {
            const tr = this.#createHeaderRow(columns, level)
            thead.appendChild(tr)

            columns = columns.flatMap(col => col.stacked)
        }

        const oldThead = this.#table.querySelector('thead')

        oldThead.replaceWith(thead)
    }

    /**
     * @param { string } uid
     */
    refreshColumn(uid) {

    }

    destroy() {
        this.#panel.remove()
    }

    /**
     * @param { Column[] } columns
     * @param { number } level
     */
    #createHeaderRow(columns, level) {
        const tr = document.createElement('tr')

        for (const column of columns) {
            const colSpan = column.isStacked() ? column.stacked.length : 1
            const rowSpan = column.isStacked() ? 1 : 2

            const th = this.#createCell(column)
            th.colSpan = colSpan
            th.rowSpan = rowSpan
            tr.appendChild(th)
        }

        return tr
    }

    /**
     * @param { Column } column
     * @returns { HTMLTableCellElement }
     */
    #createCell(column) {
        const th = document.createElement('th')
        th.classList.add(...column.css)
        th.dataset.index = column.index
        th.dataset.uid = column.uid

        if (column.sortable) {
            th.classList.add('sortable')
        }

        if (column.showMenu) {
            th.classList.add('menuable')
        }

        if (column.resizable) {
            th.classList.add('resizalbe')
        }

        th.innerText = column.title
    }
}

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

    updatePinOffsets() {
        const columns = this.table.getFlatColumns()
            .filter(column => column.isPinned)

        let offset = 0
        for (const column of columns) {
            const cell = this.table.getColumnHeader(column)

            cell.style.left = offset + 'px'
            offset += column.width
        }
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
