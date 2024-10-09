
class Row {

    /**
     * @type { string[] }
     */
    css

    /**
     * @type { string }
     */
    executable

    /**
     * @type { string }
     */
    dropdownTmpl

    /**
     * @type { { [a: string]: string } }
     */
    attrs


    /**
     * @param { RowModel } row
     */
    constructor(row) {
        this.css = SplitGridHelpers.parseCss(row.css)
        this.executable = row.executable
        this.dropdownTmpl = SplitGridHelpers.decodeTempalte(row.dropdownTmpl)
        this.attrs = row.attrs
    }
}
