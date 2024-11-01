
class Column {

    /**
     * Id is used to push changes to actual column on server
     * @type { number | null }
     */
    id

    /**
     * Unique id is used to search column in columns array
     * @type { string }
     */
    uid

    /**
     * @type { number | null }
     */
    index

    /**
     * @type { string }
     */
    parentUid

    /**
     * @type { number }
     */
    minWidth

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
    showMenu

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
     * @type { ControlColumn | null }
     */
    controlColumn

    /**
     * @type { string }
     */
    summaryExpr

    isControlColumn() {
        return this.controlColumn !== null
    }

    isStacked() {
        return this.stacked.length !== 0
    }

    hasStackedParent() {
        return this.parentUid != null
    }


    /**
     * @type { boolean }
     */
    isPinned


    /**
     * @param { ColumnModel } column
     */
    constructor(column, formatter) {
        this.uid = column.uid
        this.id = column.id
        this.index = column.index
        this.parentUid = column.parentUid

        this.title = column.title
        this.field = column.field
        this.spreadField = column.spreadField
        this.spreadIndex = column.spreadIndex

        this.type = column.type
        this.format = column.format

        this.minWidth = column.minWidth || Column.defaultMinWidth
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

        this.showMenu = column.showMenu
        this.totalable = column.totalable
        this.filterable = column.filterable
        this.resizable = column.resizable
        this.sortable = column.sortable
        this.isSorted = column.isSorted
        this.sortedBy = column.sortedBy
        this.controlColumn = column.controlColumn
        this.summaryExpr = column.summaryExpr

        this.stacked = column.stacked.map(c => new Column(c, formatter))

        this.isPinned = false

        this.#formatter = formatter
    }

    setPin(value) {
        this.isPinned = value
        this.resizable = !value

        if (this.isStacked()) {
            this.stacked.forEach(stacked =>
                stacked.setPin(value))
        }
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
        var value = this.spreadField ?
            data[this.spreadField][this.spreadIndex][this.field] :
            data[this.field];

        if (!value && this.type === ColumnType.String) {
            return ''
        }

        return value
    }


    /**
     * @type { FormatService }
     */
    #formatter

    formatToString(value) {
        switch (this.format) {
            case ColumnFormat.DateTime:
                return this.#formatter.dateTime(value)

            case ColumnFormat.Numeric:
                return this.#formatter.numeric(value || 0)

            case ColumnFormat.Percentage:
                return this.#formatter.percentage(value || 0)

            case ColumnFormat.Currency:
                return this.#formatter.currency(value || 0)

            case ColumnFormat.Empty:
            default:
                return value
        }
    }

    /**
     * @param { HTMLElement } element
     * @param { any } value
     */
    formatElement(value, element) {
        element.innerHTML = this.formatToString(value)

        if (this.type === ColumnType.Numeric && value < 0) {
            element.classList.add('negative')
        }
    }

    getSortComparator() {
        if (this.type === ColumnType.Numeric) {
            return (a, b) => a - b
        }

        if (this.type === ColumnType.Datetime) {
            return (a, b) => Date.parse(a) - Date.parse(b)
        }

        if (this.type === ColumnType.String) {
            return (a, b) => a.localeCompare(b)
        }
    }

    static defaultMinWidth = 50
}
