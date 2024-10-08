
class Splitter {

    /**
     * @type { SplitGrid }
     */
    grid

    /**
     * @type { SplitPanel[] }
     */
    panels

    /**
     * @type { HTMLElement[] }
     */
    panelElements = []

    /**
     * @private
     * @type { HTMLElement[] }
     */
    dividerElements = []

    constructor(grid) {
        this.grid = grid
        this.panels = this.grid.splits
    }

    render() {
        const container = document.createElement('div')
        container.classList.add('splitter')

        const equalsWidth = (100 / this.panels.length).toFixed(2) + "%"

        for (let i = 0; i < this.panels.length; i++) {
            const panel = this.panels[i]

            const panelEl = this.#renderPanel(panel, equalsWidth)
            this.panelElements.push(panelEl)

            container.appendChild(panelEl)

            if (i + 1 < this.panels.length) {
                const dividerEl = this.#renderDivider(i, i + 1)
                this.dividerElements.push(dividerEl)

                container.appendChild(dividerEl)
            }
        }

        const gridEl = this.grid.root

        gridEl.appendChild(container)
    }

    destroy() {

    }

    

    /**
     * @param { SplitPanel } panel
     * @returns { HTMLElement }
     */
    #renderPanel(panel, width) {
        const panelEl = document.createElement('div')
        panelEl.classList.add('panel')

        panelEl.style.minWidth = panel.minWidth
        panelEl.style.maxWidth = panel.maxWidth
        panelEl.style.flexBasis = width

        return panelEl
    }

    /**
     * @param { number } left
     * @param { number } rigth
     * @returns { HTMLElement }
     */
    #renderDivider(left, rigth) {
        const divider = document.createElement('div')
        divider.classList.add('divider')

        return divider
    }
}
