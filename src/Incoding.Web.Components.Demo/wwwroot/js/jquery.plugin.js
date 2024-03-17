(function ($) {

    /**
     * Split grid control initialization point
     * called once on component first render
     */

    $.fn.splitGrid = function (options = "{}") {
        options = JSON.parse(options)

        options.structure.forEach(prepareSchema);

        const splitGrid = new SplitGridController(this, options)

        this.data('splitGrid', splitGrid)
    }

    function prepareSchema(schema) {
        const rowTmpl = decodeRowTemplate(schema.rowTmpl)

        schema.rowTmpl = ExecutableInsert.Template.compile(rowTmpl)
        schema.layoutTmpl = ExecutableInsert.Template.compile(schema.layoutTmpl)
        schema.expands = {}

        if (schema.nested) {
            prepareSchema(schema.nested)
        }
    }

    function decodeRowTemplate(tmpl) {
        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

}(jQuery));

(function ($) {

    /**
     * Websocket partial loading & infinite scroll initialization
     */

    $.fn.websocketLoader = function (options) {
        options = $.extend({
            chunkSize: 40,
        }, options)

        const loader = new WebsocketLoader(options.method, options)

        loader.initialize(this)

        $(this).data('loader', loader)
    }

}(jQuery));

(function ($) {

    /**
     * Connect two scrolls to scroll simultaneously
     */

    $.fn.connectScrolls = function () {
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

}(jQuery));

(function ($) {

    /**
     * Formatting table cells
     */

    $.fn.format = function (action, precision) {
        if (action === 'precision') {
            $.fn.format.defaults.precision = Number(precision)
            return
        }

        return this.filter('[data-custom-template!="True"]').each(function () {
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

    $.fn.format.defaults = {
        precision: 2
    };

    function formatCurrency(element, value) {
        return formatNumber(element, value, {
            prefix: '$',
            postfix: ''
        })
    }

    function formatPercentage(element, value) {
        return formatNumber(element, value, {
            prefix: '',
            postfix: '%'
        })
    }

    function formatNumber(element, value, options) {
        options = $.extend({
            prefix: '',
            postfix: '',
            precision: $.fn.format.defaults.precision
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
            element.classList.add('negative')
            number = `(${number})`
        }
        else {
            element.classList.remove('negative')
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

}(jQuery));

(function ($) {

    $.fn.toggleAttribute = function (attr, on, off) {
        return this.each(function () {
            $(this).attr(attr, (_, value) => value == on ? off : on)
        })
    }

}(jQuery));

(function ($) {

    /*
    *	Masked inputs
    */
   const defaultOptions = {
        nullable: false,
        decimalScale: 2,
        negative: false,
        selectOnFocus: false,
        type: 'currency'
   }

    $.fn.maskedInput = function (options) {
        options = $.extend(defaultOptions, options)

        let maskIndex = 0
        const masks = prepareMasksPair(options)

        if (this.val() !== '') {
            this.val(parseFloat(this.val()).toFixed(options.decimalScale))
        }

        this.on('keydown', (event) => {
            if (options.negative) {
                if (event.which === ExecutableHelper.KeyCodes.DASH) {
                    maskIndex = (maskIndex + 1) % 2

                    this.toggleClass('ci-text-danger')

                    applyMask(this, masks[maskIndex], options)
                }
            }

            const value = this.maskMoney('unmasked')[0]
            if (event.which === ExecutableHelper.KeyCodes.BACKSPACE && value === 0) {
                this.val("")
            }
        })

        if (options.type === 'percentage') {
            this.on('keyup', (event) => {
                const parsed = parseNumber(event.target.value.replace('%', '').replace(',', ''))
                if (parsed > 100) {
                    $(event.target).maskMoney('mask', 100)
                }
            })
        }

        return applyMask(this, masks[maskIndex], options)
    }

    function prepareMasksPair(options) {
        let positiveFormat, negativeFormat
        if (options.type === 'currency') {
            positiveFormat = { prefix: '$', suffix: '' }
            negativeFormat = { prefix: '$(', suffix: ')' }
        }
        else if (options.type === 'decimal') {
            positiveFormat = { prefix: '', suffix: '' }
            negativeFormat = { prefix: '(', suffix: ')' }
        }
        else if (options.type === 'percentage') {
            positiveFormat = { prefix: '', suffix: '%' }
            negativeFormat = { prefix: '(', suffix: ')%' }
        }

        return [positiveFormat, negativeFormat]
    }

    function applyMask(input, mask, options) {
        input.maskMoney('destroy')
        input.maskMoney({
            prefix: mask.prefix,
            suffix: mask.suffix,
            allowZero: true,
            allowNegative: false,
            allowEmpty: options.nullable,
            thousands: ',',
            decimal: options.decimalScale !== 0 ? '.' : '',
            precision: options.decimalScale,
            selectAllOnFocus: options.selectOnFocus
        })

        return input.maskMoney('mask')
    }

}(jQuery));

(function ($) {

    $.fn.setSelection = function (start, end) {
        return this.each(function () {
            if (!this.focus || !this.setSelectionRange)
                return

            this.focus()
            this.setSelectionRange(start, end)
        })
    }

}(jQuery));

(function($) {

    $.fn.toggleAttribute = function(attr, onValue, offValue) {
        onValue = onValue.toString().toLowerCase()
        offValue = offValue.toString().toLowerCase()

        if (this.attr(attr) == null) {
            return this.attr(attr, onValue)
        }

        let newValue = offValue
        if (this.attr(attr).localeCompare(offValue, undefined, { sensitivity: 'base' }) === 0) {
            newValue = onValue
        }

        return this.attr(attr, newValue)
    }

}(jQuery));

(function($) {

    // Maybe ComponentsHelper here ??

    $.fn.isScrollable = function(axis = 'vertical') {
        const {
            scroll,
            client
        } = axis === 'vertical' ?
            { scroll: this[0].scrollHeight, client: this[0].clientHeight } :
            { scroll: this[0].scrollWidth, client: this[0].clientWidth }

        return scroll > client
    }

} (jQuery));

(function() {

    const current = {
        $selection: $(),
        $active: $(),

        inputInFocus: false,
    }

    $.fn.excelField = function() {
        return this.find('[excel-field]').each(function() {
            const $cell = $(this).addClass('excel-field').prop('tabindex', 0)
            const $input = $cell.find('input').prop('tabindex', -1)

            $cell.on('mousedown', function(event) {
                event.preventDefault()

                if (current.inputInFocus && current.$active[0].isSameNode(event.target)) {
                    return
                }

                if (current.inputInFocus) {
                    applyChanges()
                }

                if (event.ctrlKey) {
                    addSelection($cell)
                }

                if (event.shiftKey) {
                    addRangeSelection($cell)
                }

                if (!event.ctrlKey && !event.shiftKey) {
                    resetSelection($cell)
                }

                current.$selection.addClass('selected')
                $cell.trigger('focus')

                console.log('asd', $cell);

                current.$active = $cell

                deactivateInput($cell)
            })
            .on('dblclick', function() {
                if (current.inputInFocus) {
                    return
                }

                activateInput($cell, false)
            })
            .on('keydown', function(event) {
                if (current.inputInFocus) {
                    return
                }

                if (event.key.length  === 1 || event.which === ExecutableHelper.KeyCodes.BACKSPACE) {
                    activateInput($cell, true)
                }
            })
            .on('keyup', function(event) {
                if (event.which === ExecutableHelper.KeyCodes.TAB) {
                    applyChanges($cell)

                    current.$active = $cell.trigger('focus')

                    resetSelection($cell)
                }

                if (!current.inputInFocus) {
                    return
                }

                if (event.which === ExecutableHelper.KeyCodes.ESCAPE) {
                    deactivateInput($cell)
                }

                if (event.which === ExecutableHelper.KeyCodes.ENTER) {
                    applyChanges()
                    deactivateInput($cell)
                }
            })
        })
    }

    function applyChanges() {
        const {
            $active,
            $selection
        } = current
        const value = $active.find('input').val()

        $selection.each(function() {
            const $input = $(this).find('input')

            $input.val(value)

            if (!$(this).is($active)) {
                $input.trigger('change')
            }
        })

        deactivateInput($active)
    }

    function addRangeSelection($current) {
        const { $active } = current;

        const $table = $active.closest('table')

        const columns = [$active[0].cellIndex, $current[0].cellIndex].sort((x, y) => x - y)
        const rows = [$active[0].parentElement.rowIndex, $current[0].parentElement.rowIndex].sort((x, y) => x - y)

        const $rows = $table.find('tr')

        for (let r = rows[0]; r <= rows[1]; r++) {
            const $cells = $rows.eq(r).find('td')

            for (let c = columns[0]; c <= columns[1]; c++) {
                const $cell = $cells.eq(c)

                addSelection($cell)
            }
        }
    }

    function addSelection($cell) {
        current.$selection = current.$selection.add($cell)
    }

    function resetSelection($cell) {
        current.$selection.removeClass('selected')
        current.$selection = $cell
    }

    function activateInput($cell, resetValue = false) {
        const $input = $cell.find('input')

        if (resetValue) {
            $input.val('')
        }

        $input.focus()

        current.inputInFocus = true
    }

    function deactivateInput($cell) {
        current.inputInFocus = false
        $cell.trigger('focus')
    }

} (jQuery));
