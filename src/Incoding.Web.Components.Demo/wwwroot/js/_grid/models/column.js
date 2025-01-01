
class ColumnModel {

    /**
     * Id is used to push changes to Schema on server
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
     * @type { string }
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
     * @type { SortOrder | null }
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
    allowEdit

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
     * @type { ColumnModel[] }
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

    /**
     * @type { boolean }
     */
    isPinned

    /**
     * @type { boolean }
     */
    isFiltered

    #contentTmpl
    #executableTmpl

    /**
     * @type { FormatService }
     */
    #formatter


    /**
     * @param { IColumn } column
     * @param { FormatService } formatter
     */
    constructor(column, formatter) {
        this.stacked = column.stacked.map(c => new ColumnModel(c, formatter))

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

        this.minWidth = column.minWidth || ColumnModel.DEFAULT_MIN_WIDTH
        this.width = column.width

        if (column.stacked && column.stacked.length !== 0) {
            this.width = DataUtil.aggregate(column.stacked, 'width', 'sum')
        }

        this.alignment = column.alignment
        this.attrs = column.attrs
        this.css = column.css

        if (column.executable) {
            this.executable = TemplateHelper.decodeTempalte(column.executable)
            this.#executableTmpl = ExecutableInsert.Template.compile(this.executable)
        }

        if (column.content) {
            this.content = TemplateHelper.decodeTempalte(column.content)
            this.#contentTmpl = ExecutableInsert.Template.compile(this.content)
        }

        this.hidden = column.hidden

        this.showMenu = column.showMenu
        this.allowEdit = column.allowEdit
        this.resizable = column.resizable && !this.isStacked()
        this.totalable = column.totalable
        this.filterable = column.filterable
        this.sortable = column.sortable
        this.isSorted = column.isSorted
        this.sortedBy = column.sortedBy
        this.controlColumn = column.controlColumn
        this.summaryExpr = column.summaryExpr

        this.isPinned = false
        this.isFiltered = false

        this.#formatter = formatter
    }

    isControlColumn() {
        return this.controlColumn !== null
    }

    isStacked() {
        return this.stacked.length !== 0
    }

    hasStackedParent() {
        return this.parentUid != null
    }

    getTempalteFn() {
        return this.#contentTmpl
    }

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

    getField() {
        return this.spreadField ?
            `${this.spreadField}.${this.spreadIndex}.${this.field}` :
            this.field
    }

    setPin(value) {
        this.isPinned = value
        this.resizable = !value

        if (this.isStacked()) {
            this.stacked.forEach(stacked =>
                stacked.setPin(value))
        }
    }


    /**
     * @param { any } value
     * @returns { string }
     */
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
                return value ? String(value) : ''
        }
    }

    /**
     * @param { HTMLElement } element
     * @param { any } value
     */
    formatElement(value, element) {
        element.innerHTML = this.formatToString(value)

        if (this.type === ColumnType.Numeric && value < 0) {
            element.classList.add(classes.negative)
        }
    }

    getAscSortComparator() {
        if (this.type === ColumnType.Numeric) {
            return (a, b) => a - b
        }

        if (this.type === ColumnType.Datetime) {
            return (a, b) => Date.parse(a) - Date.parse(b)
        }

        if (this.type === ColumnType.String) {
            return (a, b) => a.localeCompare(b)
        }

        if (this.type === ColumnType.Boolean) {
            return (a, b) => a ? 1 : -1
        }
    }

    clone() {
        const column = new ColumnModel({
            id: this.id,
            uid: this.uid,
            index: this.index,
            parentUid: this.parentUid,
            minWidth: this.minWidth,
            width: this.width,
            field: this.field,
            title: this.title,
            css: this.css,
            spreadIndex: this.spreadIndex,
            spreadField: this.spreadField,
            executable: this.executable,
            content: this.content,
            type: this.type,
            format: this.format,
            alignment: this.alignment,
            sortedBy: this.sortedBy,

            totalable: this.totalable,
            sortable: this.sortable,
            filterable: this.filterable,
            showMenu: this.showMenu,
            resizable: this.resizable,

            allowEdit: this.allowEdit,
            hidden: this.hidden,
            attrs: this.attrs,
            isSorted: this.isSorted,

            stacked: [],
            controlColumn: this.controlColumn,
            summaryExpr: this.summaryExpr,
        }, this.#formatter)

        column.stacked = this.stacked.map(s => s.clone())

        return column
    }

    static DEFAULT_MIN_WIDTH = 50

    static MAX_WIDTH = 700
}
