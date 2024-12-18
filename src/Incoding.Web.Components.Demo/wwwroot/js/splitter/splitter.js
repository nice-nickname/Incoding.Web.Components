

class Splitter {

    /**
     * @type { SplitPanelModel[] }
     */
    panelsModel

    /**
     * @type { HTMLElement }
     */
    root

    /**
     * @type { HTMLElement[] }
     */
    #panelElements = []

    /**
     * @type { HTMLElement[] }
     */
    #dividerElements = []

    constructor(splits) {
        this.panelsModel = splits

        this.root = document.createElement('div')
        this.root.classList.add('splitter')

        const equalsWidth = (100 / this.panelsModel.length).toFixed(2) + "%"

        for (let i = 0; i < this.panelsModel.length; i++) {
            const panel = this.panelsModel[i]

            const panelTag = this.#createPanel(panel, equalsWidth)
            this.#panelElements.push(panelTag)

            this.root.appendChild(panelTag)

            if (i + 1 < this.panelsModel.length) {
                const dividerTag = this.#createDivider(i, i + 1)
                this.#dividerElements.push(dividerTag)

                this.root.appendChild(dividerTag)
            }
        }
    }

    appendTo(element) {
        this.#connectScrolls()

        element.appendChild(this.root)
    }

    destroy() {
        this.#disconnectScrolls()
        this.root.remove()
    }

    getPanel(index) {
        return this.#panelElements[index]
    }

    /**
     * @param { SplitPanelModel } panelModel
     * @returns { HTMLElement }
     */
    #createPanel(panelModel, width) {
        const panel = document.createElement('div')
        panel.classList.add('panel')

        panel.style.minWidth = panelModel.minWidth
        panel.style.maxWidth = panelModel.maxWidth
        panel.style.flexBasis = width

        return panel
    }

    /**
     * @returns { HTMLElement }
     */
    #createDivider(left, right) {
        const divider = document.createElement('div')
        divider.classList.add('divider')

        divider.addEventListener('mousedown', () => {
            const resizer = new SplitterResizeHandler(this.root, this.#panelElements[left], this.#panelElements[right], divider)
            resizer.start()
        })

        return divider
    }

    #connectScrolls() {
        for (const panel of this.#panelElements) {
            panel.addEventListener('scroll', this.#handleScroll)
        }
    }

    #disconnectScrolls() {
        for (const panel of this.#panelElements) {
            panel.removeEventListener('scroll', this.#handleScroll)
        }
    }

    /**
     * @param { Event } ev
     */
    #handleScroll = (ev) => {
        const target = ev.target

        for (const panel of this.#panelElements) {
            if (panel.isSameNode(target)) {
                continue
            }

            panel.scrollTop = target.scrollTop
        }
    }
}
