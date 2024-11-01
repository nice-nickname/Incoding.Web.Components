
class FormatService {

    static name = 'FormatService'

    /**
     * @type { FormatOptions }
     */
    options

    constructor(options) {
        this.options = options
    }

    numeric(value) {
        return numbro(value).format({
            mantissa: this.options.decimalScale,
            negative: "parenthesis",
            thousandSeparated: true
        })
    }

    percentage(value) {
        return numbro(value).format({
            output: "percent",
            mantissa: this.options.decimalScale,
            negative: "parenthesis",
            thousandSeparated: true
        })
    }

    currency(value) {
        return numbro(value).formatCurrency({
            mantissa: this.options.decimalScale,
            negative: "parenthesis",
            thousandSeparated: true
        })
    }

    dateTime(value) {
        if (value == undefined) {
            return ''
        }

        if (_.isDate(value)) {
            return value.toLocaleDateString()
        }

        return new Date(Date.parse(value)).toLocaleDateString()
    }
}
