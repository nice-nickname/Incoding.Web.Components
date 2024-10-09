
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
}

interface RowModel {

    css: string,

    executable: string,

    dropdownTmpl: string

    attrs: { [a: string]: string }
}

interface ColumnModel {

    id: number | null

    index: number

    parentIndex: number | null

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

    sortedBy: ColumnSortOption | null

    totalable: boolean

    sortable: boolean

    filterable: boolean

    resizable: boolean

    showMenu: boolean

    hidden: boolean

    isSorted: boolean

    attrs: { [a: string]: string }

    stacked: ColumnModel[]

}


//#region options

interface FormatOptions {

    decimalScale: number,

    dateTimeFormat: string

}

interface InfitniteScrollOptions {

    chunkSize: number,

    loadingRowsCount: number

}

interface GridUIOptions {

    placeholderRows: number

}

//#endregion options

//#region enums

enum GridMode {

    SubGrid,

    Stacked

}

enum ColumnSortOption {

    Asc,

    Desc

}

enum ColumnType {

    String,

    Numeric,

    Datetime,

    Boolean

}

enum ColumnFormat {

    Empty,

    Currency,

    Percentage,

    Numeric,

    DateTime

}

enum ColumnAsignment {

    Left,

    Right,

    Center

}

enum SpecialColumnKind {

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
    onClick: (action: string | null) => void
    onClose: (menu: Menu) => void
    onOpen: (menu: Menu) => void,

    closeOnItemClick: boolean,

    destroyOnHide: boolean
}

interface MenuItem {
    action: string

    icon: string,
    text: string,

    isDivider: string
    isDisabled: boolean

    template: string
}

//#endregion


//#region filter

interface FilterItem {
    value: string
    text: string
    selected: boolean
}

//#endregion
