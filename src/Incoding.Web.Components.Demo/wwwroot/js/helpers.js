
ExecutableHelper.KeyCodes = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    DASH: 189
};

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

class SplitGridHelpers {

    static decodeTempalte(tmpl) {
        if (!tmpl) return null

        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

    static parseCss(css) {
        return css.split(' ').filter(s => !ExecutableHelper.IsNullOrEmpty(s))
    }
}
