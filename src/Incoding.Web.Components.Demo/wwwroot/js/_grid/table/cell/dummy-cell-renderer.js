
class DummyCellRenderer {

    constructor(tag = 'td') {
        this.tag = tag;
    }

    render() {
        const td = document.createElement(this.tag);
        td.className = 'dummy';

        return td;
    }

}
