
class SplitGridHelpers {

    static decodeTempalte(tmpl) {
        if (!tmpl) return null

        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
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
