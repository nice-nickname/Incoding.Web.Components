
class RowModel {

    static ROW_ID_FIELD = 'RowId'

    /**
     * @type { string }
     */
    css

    /**
     * @type { string }
     */
    executableTmpl = null

    /**
     * @type { string }
     */
    dropdownTmpl = null

    /**
     * @type { { [a: string]: string } }
     */
    attrs


    /**
     * @param { IRow } row
     */
    constructor(row) {
        this.css = row.css
        this.attrs = row.attrs

        if (row.dropdownTmpl) {
            this.dropdownTmpl = TemplateHelper.compileTemplate(row.dropdownTmpl)
        }

        if (row.executable) {
            this.executableTmpl = TemplateHelper.compileTemplate(row.executable)
        }
    }

    clone() {
        const row = new RowModel({
            css: this.css,
            attrs: this.attrs
        })
        row.executableTmpl = this.executableTmpl
        row.dropdownTmpl = this.dropdownTmpl

        return row
    }
}
