
function initializeSplitGrid(options) {
    const grid = new SplitGrid(JSON.parse(options))
    grid.render()
};

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
        decimalScale: 0,
        negative: false,
        selectOnFocus: false,
        type: 'currency'
   }

    $.fn.unmasked = function() {
        return this.maskMoney('unmasked')[0]
    }

    $.fn.maskedVal = function(value) {
        return this.maskMoney('mask', parseFloat(value))
    }

    $.fn.maskedInput = function (options) {
        options = $.extend({}, defaultOptions, options)

        let maskIndex = 0
        const masks = prepareMasksPair(options)

        if (this.val() !== '') {
            const numericVal = parseFloat(this.val())

            if (numericVal < 0) {
                maskIndex = 1

                this.toggleClass('ci-text-danger')
            }

            this.val(numericVal.toFixed(options.decimalScale))
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

        return applyMask(this, masks[maskIndex], options)
    }

    function prepareMasksPair(options) {
        let positiveFormat, negativeFormat
        if (options.type === 'currency') {
            positiveFormat = { prefix: '$', suffix: '' }
            negativeFormat = { prefix: '$(', suffix: ')' }
        }
        else if (options.type === 'decimal' || options.type === 'integer') {
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
            thousands: options.type === 'integer' ? '' : ',',
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

(function($) {

    const current = {
        $selection: $(),
        $active: $(),

        inputInFocus: false,
    }

    $.fn.excelField = function() {
        return this.find('[excel-field]').each(function() {
            const $cell = $(this)
            const $input = $cell.find('input:not([type="hidden"])').attr('tabindex', -1)

            if ($cell.is('[disabled]')) {
                return
            }

            $cell.addClass('excel-field').prop('tabindex', 0)

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
        const value = $active.find('input:not([type="hidden"])').val()

        $selection.each(function() {
            const $input = $(this).find('input:not([type="hidden"])')

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
        const $input = $cell.find('input:not([type="hidden"])')

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

(function($) {

    $.fn.boundElementTo = function($target) {
        const bounds = $target[0].getBoundingClientRect()

        const styles = {
            top: bounds.top + bounds.height,
            left: bounds.left,
            position: 'absolute',
            zIndex: Number.MAX_SAFE_INTEGER
        }

        $(this)
            .on('hidden.bs.dropdown', () => {
                $(this).remove()
            })
            .on('shown.bs.dropdown', () => {
                requestAnimationFrame(() => {
                    $(this).find('ul').css('transform', '')
                })
            })

        return $(this).css(styles).appendTo(document.body)
    }

} (jQuery));

(function($) {

    const retryDelaysInMilliseconds  = [
        0, 10, 60, 60, 60, 60, 60, 60, 60, 60
    ].map(seconds => seconds * 1000)

    const signalrConnections = { }

    $.fn.signalr = function (action) {
        if (signalrConnections[action]) {
            return signalrConnections[action]
        }

        let builder = new signalR.HubConnectionBuilder()
            .withAutomaticReconnect(retryDelaysInMilliseconds)
            .withUrl(action)
            .configureLogging(signalR.LogLevel.Information)

        const connection = builder.build()

        connection.start().catch(console.error)
        signalrConnections[action] = connection

        return signalrConnections[action]
    }

    $.fn.signalrLoader = function(options) {
        const loader = new SignalRLoader(this[0], options)

        $(this).data('loader', loader)
    }

} (jQuery))
