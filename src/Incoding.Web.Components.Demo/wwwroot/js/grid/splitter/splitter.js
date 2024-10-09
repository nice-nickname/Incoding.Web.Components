
class Splitter {

    /**
     * @type { SplitGrid }
     */
    grid

    /**
     * @type { SplitPanelModel[] }
     */
    panels

    /**
     * @type { HTMLElement[] }
     */
    panelElements = []

    /**
     * @type { HTMLElement[] }
     */
    #dividerElements = []

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

            const panelTag = this.#renderPanel(panel, equalsWidth)
            this.panelElements.push(panelTag)

            container.appendChild(panelTag)

            if (i + 1 < this.panels.length) {
                const dividerTag = this.#renderDivider()
                this.#dividerElements.push(dividerTag)

                container.appendChild(dividerTag)
            }
        }

        const grid = this.grid.root
        grid.appendChild(container)

        this.#connectScrolls()
    }

    destroy() {
        this.#disconnectScrolls()
    }

    #connectScrolls() {
        for (const panel of this.panelElements) {
            panel.addEventListener('scroll', this.#scrollHandler)
        }
    }

    #disconnectScrolls() {
        for (const panel of this.panelElements) {
            panel.removeEventListener('scroll', this.#scrollHandler)
        }
    }

    /**
     * @param { Event } ev
     */
    #scrollHandler = (ev) => {
        const target = ev.target

        for (const panel of this.panelElements) {
            if (panel.isSameNode(target)) {
                continue
            }

            panel.scrollTop = target.scrollTop
        }
    }


    /**
     * @param { SplitPanelModel } panel
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
     * @returns { HTMLElement }
     */
    #renderDivider() {
        const divider = document.createElement('div')
        divider.classList.add('divider')

        return divider
    }
}
