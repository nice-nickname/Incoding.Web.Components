
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
        this.element.rowSpan = this.column.isStacked() || this.column.hasStackedParent() ? 1 : 2;
        this.element.colSpan = this.column.isStacked() ? this.column.stacked.length : 1;
        this.element.dataset.uid = this.column.uid
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
