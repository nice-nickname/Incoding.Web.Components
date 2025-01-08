
Array.prototype.remove = function(item) {
    const index = this.indexOf(item)

    if (index >= 0) {
        this.splice(index, 1)
    }

    return this;
}

Array.prototype.removeBy = function(predicate) {
    const index = this.findIndex(predicate)

    if (index >= 0) {
        this.splice(index, 1)
    }

    return this;
}



class TemplateHelper {

    static decodeTempalte(tmpl) {
        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

    static compileTemplate(tmpl) {
        return ExecutableInsert.Template.compile(this.decodeTempalte(tmpl))
    }

    static renderToElement(tmpl, data) {
        const template = document.createElement('template')
        template.innerHTML = ExecutableInsert.Template.render(tmpl, data)

        const element = template.content.children.item(0)

        return element
    }

    static renderToHtml(tmpl, data) {
        const compiledTmpl = ExecutableInsert.Template.compile(tmpl)
        return ExecutableInsert.Template.render(compiledTmpl, data)
    }

};

/**
 * @enum { number }
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
 */
ExecutableHelper.MouseButtons = {

    Left: 0, // Main button

    Wheel: 1, // Auxiliary button

    Right: 2, // Secondary button

    BrowserBack: 3, // Fourth additional button

    BrowserForward: 4, // Fifth additional button

};


function createGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
};
