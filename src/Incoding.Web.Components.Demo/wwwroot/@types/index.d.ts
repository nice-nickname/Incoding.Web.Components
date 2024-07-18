
interface GridOptions {
    infiniteScroll: boolean
    loadingRowCount: number
    scrollChunkSize: number

    table: TableOptions
}

interface TableOptions {
    highlightRows: boolean
    placeholderRows: number
    mode: 'Stacked' | 'Simple'
    zebra: boolean
}

interface TableStructure {
    columns: Column[]

    rowTmpl: string
    layoutHtml: string
    dropdownTmpl: string

    nestedField: string
    nested: TableStructure | null
}

interface Column {
    index: number
    field: string
    title: string

    spreadIndex: number | null
    spreadField: string

    totalable: boolean
    sortable: string

    sortedBy: 'Asc' | 'Desc' | null
    hasDefaultSort: boolean

    type: 'String' | 'Numeric' | 'Datetime' | 'Boolean'
    format: 'Empty' | 'Currency' | 'Percentage' | 'Numeric' | 'DateTime'

    parentIndex: number | null
    width: number | null
}

interface FilterColumn {
    column: Column
    criteria: Set<string>
    getter
}



interface IRowRenderer {

    handleDataUpdated(): void

    restart(): void

}
