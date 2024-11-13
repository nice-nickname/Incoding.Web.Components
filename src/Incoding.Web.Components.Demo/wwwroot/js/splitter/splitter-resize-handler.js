class SplitterResizeHandler {

    /**
     * @type { HTMLElement }
     */
    leftPanel

    /**
     * @type { HTMLElement }
     */
    rightPanel

    /**
     * @type { HTMLElement }
     */
    divider

    containerOffset

    containerWidth

    dividerWidth

    #resizeAnimationFrame = null

    constructor(container, left, right, divider) {
        this.leftPanel = left
        this.rightPanel = right
        this.divider = divider

        this.containerOffset = $(container).offset().left
        this.containerWidth = $(container).width()
        this.dividerWidth = $(divider).width()
    }

    start = () => {
        this.leftPanel.classList.add(classes.resizing)
        this.rightPanel.classList.add(classes.resizing)

        document.addEventListener('mousemove', this.resize)
        document.addEventListener('mouseup', this.stop)
    }

    /**
     * @param { MouseEvent } event
     */
    resize = (event) => {
        if (this.#resizeAnimationFrame)
            return;

        const leftOffset = event.clientX - this.containerOffset;
        const diff = leftOffset - this.divider.offsetLeft;

        const left = this.leftPanel.offsetWidth + diff;
        const right = this.rightPanel.offsetWidth - diff;

        if (this.#isValidPanelSizes(left, right)) {
            this.#resizeAnimationFrame = requestAnimationFrame(() => {
                this.leftPanel.style.flexBasis = (left * 100 / this.containerWidth) + '%';
                this.rightPanel.style.flexBasis = (right * 100 / this.containerWidth) + '%';

                this.#resizeAnimationFrame = null;
            });
        }
    }

    stop = () => {
        this.leftPanel.classList.remove(classes.resizing)
        this.rightPanel.classList.remove(classes.resizing)

        document.removeEventListener('mousemove', this.resize)
        document.removeEventListener('mouseup', this.stop)

        if (this.#resizeAnimationFrame) {
            cancelAnimationFrame(this.#resizeAnimationFrame)
            this.#resizeAnimationFrame = null
        }
    }

    #isValidPanelSizes(left, right) {
        return left - this.dividerWidth >= 0 && right + this.dividerWidth >= 0;
    }
}
