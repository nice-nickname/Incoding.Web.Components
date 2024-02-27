(function($) {


    $.fn.splitGrid = function() {
        this.data('splitGrid', new SplitGridController(this))

        return this
    }


} (jQuery))
