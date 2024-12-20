
class RowModel {

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
            const dropdown = SplitGridHelpers.decodeTempalte(row.dropdownTmpl)
            this.dropdownTmpl = ExecutableInsert.Template.compile(dropdown)
        }

        if (row.executable) {
            const executable = SplitGridHelpers.decodeTempalte(row.executable)
            this.executableTmpl = ExecutableInsert.Template.compile(executable)
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
