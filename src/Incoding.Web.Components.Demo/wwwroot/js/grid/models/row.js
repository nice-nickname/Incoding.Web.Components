
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


    #executableTmpl

    /**
     * @param { RowModel } row
     */
    constructor(row) {
        this.css = SplitGridHelpers.parseCss(row.css)
        this.dropdownTmpl = SplitGridHelpers.decodeTempalte(row.dropdownTmpl)
        this.attrs = row.attrs

        if (row.executable) {
            this.executable = SplitGridHelpers.decodeTempalte(row.executable)
            this.#executableTmpl = ExecutableInsert.Template.compile(this.executable)
        }
    }

    getExecutableFn() {
        return this.#executableTmpl
    }
}
