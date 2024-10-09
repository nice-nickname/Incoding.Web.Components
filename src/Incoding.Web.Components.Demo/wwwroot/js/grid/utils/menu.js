
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
    #clickableInside

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

        this.#clickableInside = options.clickableInside ?? false

        this.#render()
        this.#addEventListeners()
    }

    show(top, left) {
        this.#onMenuOpen()

        this.#element.style.top = top + 'px'
        this.#element.style.left = left + 'px'
        this.#element.style.position = 'absolute'
        this.#element.classList.add('show')
    }

    hide() {
        this.#element.classList.remove('show')
        this.#onMenuClose()

        this.destroy()
    }

    destroy() {
        this.#removeEventListeners()
        this.#element.remove()
    }

    getElement(selector) {
        return this.#element.querySelector(selector)
    }

    #render() {
        const ul = this.#renderMenu(this.#items)
        ul.id = this.#id
        document.body.append(ul)

        this.#element = ul
    }

    #addEventListeners() {
        this.#element.addEventListener('click', this.#handleClick)
        document.body.addEventListener('click', this.#handleGlobalClick, true)
        document.body.addEventListener('contextmenu', this.#handleGlobalClick, true)
    }

    #removeEventListeners() {
        document.body.removeEventListener('contextmenu', this.#handleGlobalClick, true)
        document.body.removeEventListener('click', this.#handleGlobalClick, true)
        this.#element.removeEventListener('click', this.#handleClick)
    }

    /**
     * @param { MenuItem[] } items
     */
    #renderMenu(items) {
        const ul = document.createElement('ul')
        ul.classList.add('dropdown-menu')

        for (const item of items) {
            const li = this.#renderItem(item)

            ul.append(li)
        }

        return ul
    }

    /**
     * @param { MenuItem } item
     */
    #renderItem(item) {
        const li = document.createElement('li')
        if (item.isDisabled) {
            li.setAttribute('disabled', '')
        }

        if (item.template) {
            li.innerHTML = item.template
        }
        else if (item.isDivider) {
            li.innerHTML = '<hr class="dropdown-divider">'
        } else {
            li.innerHTML = `<a class="dropdown-item ${item.isDisabled ? 'disabled' : ''}" href="javascript:void(0)">${item.text}</a>`
        }

        li.dataset.action = item.action || ''
        li.dataset.subAction = item.subAction || ''

        if (item.sideMenu) {
            const sideMenu = this.#renderMenu(item.sideMenu)
            li.classList.add('sidemenu')
            li.append(sideMenu)
        }

        return li
    }

    /**
     * @param { PointerEvent } ev
     */
    #handleClick = (ev) => {
        ev.stopPropagation()
        const li = ev.target.closest('li')

        if (!li || li.hasAttribute('disabled')) {
            return
        }

        const action = li.dataset.action
        const subAction = li.dataset.subAction

        const forceClick = this.#onMenuClick(action, subAction)

        if (!this.#clickableInside || forceClick === true) {
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
