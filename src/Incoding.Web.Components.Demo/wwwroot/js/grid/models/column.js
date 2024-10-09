
class Column {

    /**
     * Id is used to push changes to actual column on server
     * @type { number | null }
     */
    id

    /**
     * Unique id is used to search column is columns array
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
     * @type { SpecialColumnKind | null }
     */
    specialColumn

    isSpecialColumn() {
        return this.specialColumn !== null
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
    constructor(column) {
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
        this.specialColumn = column.specialColumnKind

        this.stacked = column.stacked.map(c => new Column(c))

        this.isPinned = false

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
            return
        }

        if (this.format === ColumnFormat.DateTime) {
            formatDateTime(element, value)
        }

        if (this.type === ColumnType.Numeric) {
            const numericFormatter = new Intl.NumberFormat('en-US', {
                maximumFractionDigits: options.decimalScale,
                minimumFractionDigits: options.decimalScale
            })

            let valueStr = numericFormatter.format(value)

            if (value < 0) {
                element.classList.add('negative')
            }

            if (this.format === ColumnFormat.Currency) {
                if (value < 0) {
                    valueStr = valueStr.replace('-', '($')  + ')'
                } else {
                    valueStr = '$' + valueStr
                }
                element.innerText = valueStr
            }

            if (this.format === ColumnFormat.Percentage) {
                if (value < 0) {
                    valueStr = valueStr.replace('-', '(')  + '%)'
                } else {
                    valueStr += '%'
                }
                element.innerHTML = valueStr
            }

            if (this.format === ColumnFormat.Numeric) {
                if (value < 0) {
                    valueStr = valueStr.replace('-', '(')  + ')'
                }

                element.innerHTML = valueStr
            }
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
}

function formatDateTime(element, value) {
    if (!value) {
        return ''
    }
    const parsed = new Date(Date.parse(value)).toLocaleString('en-US', { month: 'numeric', year: 'numeric', day: 'numeric' })

    element.innerText = parsed
}
