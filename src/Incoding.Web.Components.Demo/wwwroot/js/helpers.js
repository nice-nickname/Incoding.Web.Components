
const ColumnFormat = {
    DateTime: 'DateTime',
    Percentage: 'Percentage',
    Currency: 'Currency',
    Numeric: 'Numeric',
    Empty: 'Empty'
};

const ColumnType = {
    String: 'String',
    Numeric: 'Numeric',
    Datetime: 'Datetime',
    Boolean: 'Boolean'
};

const GridMode = {
    SubGrid: 'SubGrid',
    Stacked: 'Stacked'
};

const ColumnSortOption = {
    Asc: 'Asc',
    Desc: 'Desc'
};

const SpecialColumnKind = {
    Expand: 'Expand',
    Dropdown: 'Dropdown'
}

class SplitGridHelpers {

    static decodeTempalte(tmpl) {
        if (!tmpl) return null

        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

    static parseCss(css) {
        return css?.split(' ').filter(s => !ExecutableHelper.IsNullOrEmpty(s)) || []
    }
}
