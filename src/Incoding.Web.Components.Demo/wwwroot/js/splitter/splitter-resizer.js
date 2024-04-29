class SplitterResizingHandler {

    /**
     * @type { Splitter }
     */
    splitter;

    /**
     * @type { number }
     */
    rootOffset;

    /**
     * @type { number }
     */
    totalWidth;

    /**
     * @type { number }
     */
    splitterWidth;

    /**
     * @type { HTMLElement }
     */
    leftPanel;

    /**
     * @type { HTMLElement }
     */
    rightPanel;

    /**
     * @type { HTMLElement }
     */
    splitterElement;

    #waitNextFrame = null;

    #resizeBind;

    constructor(controller, left, splitter, right) {
        this.splitter = controller;
        this.leftPanel = left;
        this.splitterElement = splitter;
        this.rightPanel = right;

        const $root = this.splitter.$root;

        this.rootOffset = $root.offset().left;
        this.splitterWidth = $(splitter).width();
        this.totalWidth = $(left).width() + $(right).width();
    }

    start() {
        this.#resizeBind = this.resize.bind(this);

        document.addEventListener('mousemove', this.#resizeBind);

        this.splitter.$splitterElements.addClass('resizing');
    }

    /**
     * @param { MouseEvent } event
     */
    resize(event) {
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

    stop() {
        document.removeEventListener('mousemove', this.#resizeBind);

        this.splitter.$splitterElements.removeClass('resizing');

    }

    #isValidPanelSizes(left, right) {
        return left - this.splitterWidth >= 0 && right + this.splitterWidth >= 0;
    }

    /**
     * @type { SplitterResizingHandler }
     */
    static global = null;

    static start() {
        this.global.start();
    }

    static stop() {
        this.global.stop();
        this.global = null;
    }

    static isResizing() {
        return this.global !== null;
    }

    static initGlobalHandler() {
        document.addEventListener('mouseup', () => {
            if (!this.isResizing())
                return;

            this.stop();
        });
    }
}

SplitterResizingHandler.initGlobalHandler();
