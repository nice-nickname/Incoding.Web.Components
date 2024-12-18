
class RowModel {

    /**
     * @type { string }
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
     * @param { IRow } row
     */
    constructor(row) {
        this.css = row.css
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
