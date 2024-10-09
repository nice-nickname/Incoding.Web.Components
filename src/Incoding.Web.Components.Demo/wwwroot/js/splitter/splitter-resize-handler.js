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
    splitterElement

    rootOffset

    splitterWidth

    #waitNextFrame = null

    constructor(container, left, right, splitter) {
        this.leftPanel = left
        this.rightPanel = right
        this.splitterElement = splitter

        this.rootOffset = $(container).offset().left
        this.splitterWidth = $(splitter).width()
    }

    start = () => {
        this.leftPanel.classList.add('resizing')
        this.rightPanel.classList.add('resizing')

        document.addEventListener('mousemove', this.resize)
        document.addEventListener('mouseup', this.stop)
    }

    /**
     * @param { MouseEvent } event
     */
    resize = (event) => {
        if (this.#waitNextFrame)
            return;

        const leftOffset = event.clientX - this.rootOffset;
        const diff = leftOffset - this.splitterElement.offsetLeft;

        const left = this.leftPanel.offsetWidth + diff;
        const right = this.rightPanel.offsetWidth - diff;

        if (this.#isValidPanelSizes(left, right)) {
            this.#waitNextFrame = requestAnimationFrame(() => {
                this.leftPanel.style.flexBasis = left + 'px';
                this.rightPanel.style.flexBasis = right + 'px';

                this.#waitNextFrame = null;
            });
        }
    }

    stop = () => {
        this.leftPanel.classList.remove('resizing')
        this.rightPanel.classList.remove('resizing')

        document.removeEventListener('mousemove', this.resize)
        document.removeEventListener('mouseup', this.stop)
    }

    #isValidPanelSizes(left, right) {
        return left - this.splitterWidth >= 0 && right + this.splitterWidth >= 0;
    }
}
