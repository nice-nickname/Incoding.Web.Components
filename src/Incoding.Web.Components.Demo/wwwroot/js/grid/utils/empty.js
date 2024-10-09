
class Empty {

    /**
     * @type { HTMLElement }
     */
    root

    constructor(tmpl) {
        this.root = document.createElement('div')
        this.root.classList.add('empty', 'hidden')
        this.root.innerHTML = tmpl
    }

    /**
     * @param { HTMLElement } element
     */
    appendTo(element) {
        element.append(this.root)
    }
}
