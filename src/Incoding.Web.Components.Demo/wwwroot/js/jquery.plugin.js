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

        this.data('splitGrid', splitGrid)
    }

    function prepareSchema(schema) {
        const rowTmpl = decodeRowTemplate(schema.RowTemplate)

        schema.RowTemplate = ExecutableInsert.Template.compile(rowTmpl)
        schema.LayoutHtml = ExecutableInsert.Template.compile(schema.LayoutHtml)
        schema.expands = { }

        if (schema.NestedTable) {
            prepareSchema(schema.NestedTable)
        }
    }

    function decodeRowTemplate(tmpl) {
        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

} (jQuery));

(function($) {

    /**
     * Websocket partial loading & infinite scroll initialization
     */

    $.fn.websocketLoader = function(options) {
        options = $.extend({
            chunkSize: 40,
        }, options)

        const loader = new WebsocketLoader(options.method, options)

        loader.initialize(this)

        $(this).data('loader', loader)
    }

} (jQuery));

(function($) {

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
     * Formatting table cells
     */

    $.fn.format = function() {
        return this.each(function() {
            const format = this.dataset.format
            const value = this.dataset.value

            switch (format) {
                case 'Numeric':
                    formatNumber(this, value)
                    break;
                case 'Currency':
                    formatCurrency(this, value)
                    break;
                case 'Percentage':
                    formatPercentage(this, value)
                    break;
                case 'DateTime':
                    formatDateTime(this, value)
                    break;
                default:
                    break;
            }
        })
    }

    function formatCurrency(element, value) {
        return formatNumber(element, value, {
            prefix: '$',
            postfix: '',
            precision: 2
        })
    }

    function formatPercentage(element, value) {
        return formatNumber(element, value, {
            prefix: '',
            postfix: '%',
            precision: 2
        })
    }

    function formatNumber(element, value, options) {
        options = $.extend({
            prefix: '',
            postfix: '',
            precision: 2
        }, options)

        const {
            prefix,
            postfix,
            precision
        } = options

        let number = Number(value) || 0

        const isNegative = number < 0
        number = Math.abs(number).toFixed(precision)
        number = `${prefix}${number}${postfix}`

        if (isNegative) {
            element.classList.add('ci-text-danger')
            number = `(${number})`
        }
        else {
            element.classList.remove('ci-text-danger')
        }

        element.innerHTML = number
    }

    function formatDateTime(element, value) {
        if (!value) {
            return ''
        }
        const parsed = new Date(Date.parse(value)).toLocaleString('en-US', { month: 'numeric', year: 'numeric', day: 'numeric' })

        element.innerHTML = parsed
    }

} (jQuery));

(function($) {

    $.fn.toggleAttribute = function(attr, on, off) {
        return this.each(function() {
            $(this).attr(attr, (_, value) => value == on ? off : on)
        })
    }

} (jQuery))
