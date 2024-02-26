(function($) {

    $.fn.initializeSplitGrid = function() {
        const controller = new SplitGridController(this)

        this.data('splitGrid', controller)
    }

} (jQuery))

class SplitGridController {

    /**
     * @type { JQuery<HTMLElement> }
     */
    $root

    /**
     * @type { JQuery<HTMLElement> }
     */
    $scroller

    /**
     * @type { JQuery<HTMLTableElement> }
     */
    $tables

    /**
     * @type { any[] }
     */
    data

    constructor(element, options) {
        this.$root = $(element)
        this.$scroller = this.$root.children().first()
        this.$tables = this.$root.find('table')

        this.data = []
    }

    initializeScroll() {
        /** listen to scroll here... */
    }

    appendData(data) {
        this.data.push(...data)
    }

    reload(data) {
        const rowId = data.RowId

        const item = this.data.find(s => s.RowId == rowId)
    }
}

class TableController {

    /**
     * @type { JQuery<HTMLTableElement> }
     */
    $table

    /**
     * @type { any[] }
     */
    data

    constructor(element) {
        this.$table = $(element)
    }

    appendData(data) {
        this.data.push(...data)
    }

    renderRows() {

    }

    renderChildren(rowId) {

    }

    totals() {

    }

    filter(criteria) {

    }

    sort(criteria) {

    }
}


class PartialLoader {
    
}
