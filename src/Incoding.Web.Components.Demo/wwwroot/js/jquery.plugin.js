(function($) {

    /**
     * Split grid control initialization point
     * called once on component first render
     */

    $.fn.splitGrid = function(schemas, options = "{}") {
        schemas = JSON.parse(schemas)
        options = JSON.parse(options)

        schemas.forEach(prepareSchema);

        const splitGrid = new SplitGridController(this, schemas, options)

        return this.data('splitGrid', splitGrid)
    }

    function prepareSchema(schema) {
        const rowTmpl = decodeRowTemplate(schema.RowTemplate)

        schema.RowTemplate = ExecutableInsert.Template.compile(rowTmpl)
        schema.LayoutHtml = ExecutableInsert.Template.compile(schema.LayoutHtml)

        if (schema.NestedTable) {
            prepareSchema(schema.NestedTable)
        }
    }

    function decodeRowTemplate(tmpl) {
        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

} (jQuery));

(function() {

    /**
     * Connect two scrolls to scroll simultaneously
     */

    $.fn.connectScrolls = function() {
        if ($(this).data('connected')) return

        const scrollables = $(this).get()

        for (let i = 0; i < scrollables.length; i++) {
            let current = scrollables[i]
            $(current)
                .on('scroll', ev => {
                    for (let j = 0; j < scrollables.length; j++) {
                        if (i != j) {
                            scrollables[j].scrollTop = current.scrollTop
                        }
                    }
                })
        }

        $(this).data('connected', true)
    }

} (jQuery));

(function($) {

    /**
     * websocket partial loading & infinite scroll implementation
     */

    $.fn.websocketLoader = function(options) {
        options = $.extend(options, {
            chunkSize: 40,
            scroller: '.splitter-panel'
        })

        const loader = new WebsocketLoader("StreamData", options)

        loader.initialize(this)
        loader.startLoading()

        $(this).data('loader', loader)
    }

} (jQuery));
