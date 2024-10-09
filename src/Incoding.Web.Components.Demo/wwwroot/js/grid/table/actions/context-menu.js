
class ContextMenu {

    /**
     * @type { SplitTable }
     */
    #table

    /**
     * @type { Menu | null }
     */
    #menu = null

    /**
     * @type { {
     *  column: Column,
     *  rowIndex: number,
     *  rowData: object
     * } }
     */
    target

    constructor(table) {
        this.#table = table
        this.#menu = this.#createMenu()

        this.#addEventListeners()
    }

    destroy() {
        this.#removeEventListeners()

        this.#menu?.destroy()
    }

    #addEventListeners() {
        this.#table.tbody.addEventListener('contextmenu', this.#handleContextMenu)
    }

    #removeEventListeners() {
        this.#table.tbody.removeEventListener('contextmenu', this.#handleContextMenu)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleContextMenu = (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        const { target, clientX, clientY } = ev

        const cell = target.closest('td')
        const row = target.closest('tr')

        const data = this.#table.getData()
        const rowIndex = Number(row.dataset.index)
        const colIndex = Number(cell.dataset.index)

        this.target = {
            column: this.#table.getColumnByIndex(colIndex),
            rowIndex: rowIndex,
            rowData: data[rowIndex]
        }

        this.#menu.show(clientY, clientX)
    }


    #createMenu() {
        return new Menu({
            items: [
                { icon: '', text: 'Copy', action: 'Copy' },
                { icon: '', text: 'Copy with heading', action: 'CopyWithHeading' }
            ],
            onOpen: () => { },
            onClose: () => { },
            onClick: this.#handleMenuClick.bind(this),
            destroyOnHide: false
        })
    }

    /**
     * @param { string | null } action
     */
    #handleMenuClick(action) {
        const clipboard = new ClipboardModule(this.#table)

        switch (action) {
            case 'Copy':
                clipboard.copyRow(this.target.rowData)
                break;

            case 'CopyWithHeading':
                clipboard.copyRow(this.target.rowData, true)
                break;

            default:
                break;
        }
    }
}
