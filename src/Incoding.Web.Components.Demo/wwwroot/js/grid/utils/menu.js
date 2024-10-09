
class Menu {

    /**
     * @type { HTMLElement }
     */
    #element

    /**
     * @type { MenuItem[] }
     */
    #items

    /**
     * @type { () => void }
     */
    #onMenuOpen

    /**
     * @type { (action: string | null) => void }
     */
    #onMenuClick

    /**
     * @type { () => void }
     */
    #onMenuClose

    /**
     * @type { boolean }
     */
    #closeOnItemClick

    /**
     * @type { boolean }
     */
    #destroyOnHide

    /**
     * @type { string }
     */
    #id

    /**
     * @param { MenuOptions } options
     */
    constructor(options) {
        this.#id = _.uniqueId()

        const noop = () => { }

        this.#items = options.items
        this.#onMenuOpen = options.onOpen || noop
        this.#onMenuClick = options.onClick || noop
        this.#onMenuClose = options.onClose || noop

        this.#closeOnItemClick = options.closeOnItemClick ?? true
        this.#destroyOnHide = options.destroyOnHide ?? true

        this.#render()
        this.#addEventListeners()
    }

    show(top, left) {
        this.#onMenuOpen(this)

        this.#element.style.top = top + 'px'
        this.#element.style.left = left + 'px'
        this.#element.style.position = 'absolute'
        this.#element.classList.add('show')
    }

    hide() {
        this.#element.classList.remove('show')

        this.#onMenuClose(this)

        if (this.#destroyOnHide) {
            this.destroy()
        }
    }

    destroy() {
        this.#removeEventListeners()
        this.#element.remove()
    }

    getElement(selector) {
        return this.#element.querySelector(selector)
    }

    #render() {
        this.#element = document.createElement('ul')
        this.#element.classList.add('dropdown-menu')
        this.#element.id = this.#id

        for (const item of this.#items) {
            this.#addItem(item)
        }

        document.body.append(this.#element)
    }

    #addEventListeners() {
        this.#element.addEventListener('click', this.#handleClick)
        document.body.addEventListener('click', this.#handleGlobalClick, true)
    }

    #removeEventListeners() {
        document.body.removeEventListener('click', this.#handleGlobalClick, true)
        this.#element.removeEventListener('click', this.#handleClick)
    }

    /**
     * @param { MenuItem } item
     */
    #addItem(item) {
        const li = document.createElement('li')

        if (item.template) {
            li.innerHTML = item.template
        }
        else if (item.isDivider) {
            li.innerHTML = '<hr class="dropdown-divider">'
        } else {
            li.innerHTML = `<a class="dropdown-item ${item.isDisabled ? 'disabled' : ''}" href="javascript:void(0)" data-action=${item.action}>${item.text}</a>`
        }

        this.#element.append(li)
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        ev.stopPropagation()

        const target = ev.target
        const action = target.dataset.action

        this.#onMenuClick(action || null)

        if (this.#closeOnItemClick) {
            this.hide()
        }
    }

    #handleGlobalClick = (ev) => {
        const isClickedInsideDropdown = $(ev.target)
            .closest(`#${this.#id}`)
            .length !== 0

        if (!isClickedInsideDropdown) {
            this.hide()
        }
    }

    /**
     * @param { HTMLElement } element
     * @param { MenuOptions } options
     */
    static fromElement(element, options) {
        const menu = new Menu({
            ...options,
            items: [],
            onClick: null
        })

        menu.#element.replaceChildren(...element.children)
        return menu
    }
}
