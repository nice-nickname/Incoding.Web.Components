class Splitter {

    /**
     * @type { JQuery<HTMLElement> }
     */
    $root

    /**
     * @type { JQuery<HTMLElement> }
     */
    $splitterElements

    /**
     * @type { boolean }
     */
    resizing

    /**
     * @type { {
     *  rootOffest: number,
     *  totalWidth: number,
     *  splitterWidth: number,
     *  elements: [left: HTMLElement, splitter: HTMLElement, right: HTMLElement],
     *  resizeFn: () => void
     * } }
     */
    current

    /**
     * @type { number | null }
     */
    raf

    constructor(element, panels) {
        this.$root = $(element)
        this.$splitterElements = this.$root.children()

        this.panels = panels

        this.initializeElements()
    }

    initializeElements() {
        this.$root.data('splitter', this)

        this.$root.children().each((order, el) => {
            const $el = $(el)

            const isDivider = $el.is('[data-divider]')

            $el.data('order', order);

            if (isDivider) {
                this.initializeDivider(order)
            }
            else {
                this.initializePanelElement(order)
            }
        })
    }

    initializePanelElement(order) {
        const panel = this.$splitterElements.eq(order)[0]

        const countOfPanels = this.$splitterElements.filter('[data-split-panel]').length

        panel.style.flexBasis = (100 / countOfPanels).toFixed(2) + "%"
    }

    initializeDivider(order) {
        const $divider = this.$splitterElements.eq(order)

        $divider.on('mousedown', () => {
            this.#startResize(order)
        })
    }

    #startResize(order) {
        const $divider = this.$splitterElements.eq(order)
        const $left = this.$splitterElements.eq(order - 1)
        const $right = this.$splitterElements.eq(order + 1)

        const handler = new SplitterResizingHandler(this, $left[0], $divider[0], $right[0])

        SplitterResizingHandler.start(handler)
    }
}
