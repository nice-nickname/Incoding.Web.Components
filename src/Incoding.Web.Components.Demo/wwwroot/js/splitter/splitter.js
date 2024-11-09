

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

            const panelTag = this.#renderPanel(panel, equalsWidth)
            this.#panelElements.push(panelTag)

            this.root.appendChild(panelTag)

            if (i + 1 < this.panelsModel.length) {
                const dividerTag = this.#renderDivider(i, i + 1)
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
    }

    getPanel(index) {
        return this.#panelElements[index]
    }


    #connectScrolls() {
        for (const panel of this.#panelElements) {
            panel.addEventListener('scroll', this.#scrollHandler)
        }
    }

    #disconnectScrolls() {
        for (const panel of this.#panelElements) {
            panel.removeEventListener('scroll', this.#scrollHandler)
        }
    }

    /**
     * @param { Event } ev
     */
    #scrollHandler = (ev) => {
        const target = ev.target

        for (const panel of this.#panelElements) {
            if (panel.isSameNode(target)) {
                continue
            }

            panel.scrollTop = target.scrollTop
        }
    }


    /**
     * @param { SplitPanelModel } panelModel
     * @returns { HTMLElement }
     */
    #renderPanel(panelModel, width) {
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
    #renderDivider(left, right) {
        const divider = document.createElement('div')
        divider.classList.add('divider')

        divider.addEventListener('mousedown', () => {
            const resizer = new SplitterResizeHandler(this.root, this.#panelElements[left], this.#panelElements[right], divider)
            resizer.start()
        })

        return divider
    }
}
