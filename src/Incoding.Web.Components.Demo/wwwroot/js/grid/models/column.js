
class Column {

    /**
     * @type { number | null }
     */
    id

    /**
     * @type { number }
     */
    index

    /**
     * @type { number | null }
     */
    parentIndex

    /**
     * @type { number | null }
     */
    width

    /**
     * @type { string }
     */
    field

    /**
     * @type { string }
     */
    title

    /**
     * @type { string[] }
     */
    css

    /**
     * @type { number | null }
     */
    spreadIndex

    /**
     * @type { string | null }
     */
    spreadField

    /**
     * @type { string }
     */
    executable

    /**
     * @type { string | null }
     */
    content

    /**
     * @type { ColumnType }
     */
    type

    /**
     * @type { ColumnFormat }
     */
    format

    /**
     * @type { ColumnAsignment }
     */
    alignment

    /**
     * @type { ColumnSortOption | null }
     */
    sortedBy

    /**
     * @type { boolean }
     */
    totalable

    /**
     * @type { boolean }
     */
    sortable

    /**
     * @type { boolean }
     */
    filterable

    /**
     * @type { boolean }
     */
    resizable

    /**
     * @type { boolean }
     */
    hidden

    /**
     * @type { boolean }
     */
    isSorted

    /**
     * @type { { [a: string]: string } }
     */
    attrs

    /**
     * @type { Column[] }
     */
    stacked

    /**
     * @param { ColumnModel } column
     */
    constructor(column) {
        this.id = column.id
        this.index = column.index
        this.parentIndex = column.parentIndex

        this.title = column.title
        this.field = column.field
        this.spreadField = column.spreadField
        this.spreadIndex = column.spreadIndex

        this.type = column.type
        this.format = column.format

        this.width = column.width
        this.alignment = column.alignment
        this.attrs = column.attrs
        this.css = SplitGridHelpers.parseCss(column.css)

        this.executable = SplitGridHelpers.decodeTempalte(column.executable)
        if (this.executable) {
            this.#executableTmpl = ExecutableInsert.Template.compile(this.executable)
        }

        this.content = SplitGridHelpers.decodeTempalte(column.content)
        if (this.content) {
            this.#contentTmpl = ExecutableInsert.Template.compile(this.content)
        }

        this.hidden = column.hidden

        this.totalable = column.totalable
        this.filterable = column.filterable
        this.resizable = column.resizable
        this.sortable = column.sortable
        this.isSorted = column.isSorted
        this.sortedBy = column.sortedBy

        this.stacked = column.stacked.map(c => new Column(c))
    }

    #contentTmpl

    getTempalteFn() {
        return this.#contentTmpl
    }


    #executableTmpl

    getExecutableFn() {
        return this.#executableTmpl
    }


    /**
     * @param { object } data
     */
    getValue(data) {
        return this.spreadField ?
                data[this.spreadField][this.spreadIndex][this.field] :
                data[this.field]
    }


    /**
     * m-debug optimize
     * @param { HTMLElement } element
     * @param { any } value
     * @param { FormatOptions } options
     */
    formatValue(element, value, options) {

        if (this.format === ColumnFormat.Empty) {
            element.innerHTML = value
        }

        if (this.format === ColumnFormat.DateTime) {
            formatDateTime(element, value)
        }

        if (this.format === ColumnFormat.Currency) {
            formatNumber(element, value, {
                prefix: '$',
                postfix: '',
                precision: options.decimalScale
            })
        }

        if (this.format === ColumnFormat.Percentage) {
            formatNumber(element, value, {
                prefix: '',
                postfix: '%',
                precision: options.decimalScale
            })
        }

        if (this.format === ColumnFormat.Numeric) {
            formatNumber(element, value, {
                prefix: '',
                postfix: '',
                precision: options.decimalScale
            })
        }
    }
}

function formatDateTime(element, value) {
    if (!value) {
        return ''
    }
    const parsed = new Date(Date.parse(value)).toLocaleString('en-US', { month: 'numeric', year: 'numeric', day: 'numeric' })

    element.innerHTML = parsed
}

function formatNumber(element, value, options) {
    const {
        prefix,
        postfix,
        precision
    } = options

    let number = Number(value) || 0

    const isNegative = number < 0
    number = formatNumericString(Math.abs(number), precision)
    number = `${prefix}${number}${postfix}`

    if (isNegative) {
        element.classList.add('negative')
        number = `(${number})`
    }
    else {
        element.classList.remove('negative')
    }

    element.innerHTML = number
    element.setAttribute('title', number)
}

function formatNumericString(number, decimalScale) {
    var parts = number.toString().split('.');
    var integerPart = parts[0];
    var decimalPart = parts.length > 1 ? parts[1] : '';

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (decimalScale > 0) {
        decimalPart = decimalPart.padEnd(decimalScale, '0').slice(0, decimalScale);
        return integerPart + '.' + decimalPart;
    } else {
        return integerPart;
    }
}
