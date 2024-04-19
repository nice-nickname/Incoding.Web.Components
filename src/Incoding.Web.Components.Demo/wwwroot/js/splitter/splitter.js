(function () {

    $.fn.splitter = function (panels) {
        panels = JSON.parse(panels)

        this.data('splitter', new Splitter(this[0], panels))
    }

}(jQuery));


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
     * @type { JQuery<HTMLElement> }
     */
    $panels

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
            this.startResize(order)
        })

        document.addEventListener('mouseup', () => {
            this.stopResize()
        })
    }

    startResize(order) {
        this.resizing = true

        this.current = this.prepareCurrent(order)

        this.raf = null

        this.$splitterElements.addClass('resizing')

        document.addEventListener('mousemove', this.current.resizeFn)
    }

    resize(event) {
        if (!this.resizing || this.waitNextFrame) return

        const {
            totalWidth,
            rootOffest,
            splitterWidth,
        } = this.current

        const [left, divider, right] = this.current.elements

        const leftOffset = event.clientX - rootOffest
        const diff = leftOffset - divider.offsetLeft

        const l = left.offsetWidth + diff
        const r = right.offsetWidth - diff

        if (l - splitterWidth >= 0 && l + splitterWidth <= totalWidth) {
            this.waitNextFrame = requestAnimationFrame(() => {
                left.style.flexBasis = l + 'px'
                right.style.flexBasis = r + 'px'

                this.waitNextFrame = null
            })
        }
    }

    stopResize() {
        if (!this.resizing) return

        this.$splitterElements.removeClass('resizing')

        document.removeEventListener('mousemove', this.current.resizeFn)

        this.resizing = false
        this.current = null
    }

    prepareCurrent(order) {
        const $divider = this.$splitterElements.eq(order)
        const $left = this.$splitterElements.eq(order - 1)
        const $right = this.$splitterElements.eq(order + 1)

        return {
            splitterWidth: $divider.width(),
            rootOffest: this.$root.offset().left,
            totalWidth: $left.width() + $right.width(),
            elements: [$left[0], $divider[0], $right[0]],
            resizeFn: this.resize.bind(this)
        }
    }
}
