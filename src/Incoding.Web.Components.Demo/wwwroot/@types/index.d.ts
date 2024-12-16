
interface ISplitPanel {

    minWidth: string | null,

    maxWidth: string | null,

}

interface ISplitTable {

    id: string

    css: string,

    row: IRow

    columns: IColumn[]

    nestedField: string,

    nested: ISplitTable

    summary: ISplitTableSummary | null
}

interface ISplitTableSummary {
    title: string
}

interface IRow {

    css: string,

    executable: string,

    dropdownTmpl: string

    attrs: { [a: string]: string }
}

interface IColumn {

    uid: string

    id: number | null

    index: number

    parentUid: number | null

    minWidth: number | null

    width: number | null

    field: string

    title: string

    css: string

    spreadIndex: number | null

    spreadField: string | null

    executable: string

    content: string | null

    type: ColumnType

    format: ColumnFormat

    alignment: ColumnAsignment

    sortedBy: ColumnSortOrder | null

    totalable: boolean

    sortable: boolean

    filterable: boolean

    resizable: boolean

    showMenu: boolean

    allowEdit: boolean,

    hidden: boolean

    isSorted: boolean

    attrs: { [a: string]: string }

    stacked: IColumn[]

    controlColumn: ControlColumn

    summaryExpr: string

}


//#region options

interface IFormatOptions {

    decimalScale: number

}

interface IInfitniteScrollOptions {

    chunkSize: number,

    loadingRowsCount: number

}

interface IUIOptions {

    placeholderRows: number

}

type Aggregate = "sum" | "avg" | "min" | "max" | "count"

//#endregion options

//#region enums

declare enum GridMode {

    SubGrid,

    Stacked

}

declare enum ColumnSortOrder {

    Asc,

    Desc

}

declare enum ColumnType {

    String,

    Numeric,

    Datetime,

    Boolean

}

declare enum ColumnFormat {

    Empty,

    Currency,

    Percentage,

    Numeric,

    DateTime

}

declare enum ColumnAsignment {

    Left,

    Right,

    Center

}

declare enum ControlColumn {

    Expand,

    Dropdown

}

//#endregion

interface RenderingBehaviour {

    reset(): void

    handleDataChanged(): void

}


//#region menu

interface MenuOptions {
    items: MenuItem[]
    onClick: (action?: string, subMenuAction?: string) => void
    onClose: () => void
    onOpen: () => void,

    clickableInside: boolean,
}

interface MenuItem {
    action?: string
    subAction?: string

    icon: string,
    text: string,

    isDivider: string
    isDisabled: boolean

    template: string

    sideMenu?: MenuItem[]
}

//#endregion


//#region filter

interface FilterItem {
    value: string
    text: string
    selected: boolean
    visible: boolean
}

//#endregion
