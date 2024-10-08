
interface SplitPanel {

    minWidth: string | null,

    maxWidth: string | null,

}

interface SplitTableSchema {

    id: string

    css: string,

    row: Row

    columns: Column[]

    nestedField: string,

    nested: SplitTableSchema
}

interface Row {

    css: string,

    executable: string,

    DropdownTmpl: string

    attrs: { [a: string]: string }
}

interface Column {

    id: number | null

    index: number

    parentIndex: number | null

    width: number | null

    field: string

    title: string

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

    hidden: boolean

    isSorted: boolean

    attrs: { [a: string]: string }

    stacked: Column[]

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

//#endregion

// interface FilterColumn {
//     column: Column
//     criteria: Set<string>
//     getter
// }

// interface GridOptions {
//     infiniteScroll: boolean
//     loadingRowCount: number
//     scrollChunkSize: number

//     table: TableOptions
// }

// interface TableOptions {
//     highlightRows: boolean
//     placeholderRows: number
//     mode: 'Stacked' | 'Simple'
//     zebra: boolean
// }

// interface TableStructure {
//     columns: Column[]

//     rowTmpl: string
//     layoutHtml: string
//     dropdownTmpl: string

//     nestedField: string
//     nested: TableStructure | null
// }



// interface IRowRenderer {

//     handleDataUpdated(): void

//     restart(): void

// }
