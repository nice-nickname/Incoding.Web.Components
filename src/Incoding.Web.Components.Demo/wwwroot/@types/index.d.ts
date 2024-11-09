
interface SplitPanelModel {

    minWidth: string | null,

    maxWidth: string | null,

}

interface SplitTableModel {

    id: string

    css: string,

    row: RowModel

    columns: ColumnModel[]

    nestedField: string,

    nested: SplitTableModel

    summary: SplitTableSummaryModel | null
}

interface SplitTableSummaryModel {
    title: string
}

interface RowModel {

    css: string,

    executable: string,

    dropdownTmpl: string

    attrs: { [a: string]: string }
}

interface ColumnModel {

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

    stacked: ColumnModel[]

    controlColumn: ControlColumn

    summaryExpr: string

}


//#region options

interface FormatOptions {

    decimalScale: number

}

interface InfitniteScrollOptions {

    chunkSize: number,

    loadingRowsCount: number

}

interface GridUIOptions {

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
