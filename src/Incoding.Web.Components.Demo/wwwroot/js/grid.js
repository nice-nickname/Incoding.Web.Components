
// columns -> { Prop: <>, Type: <> }[]

(function($) {

    $.fn.gridComponent = function(columns, template) {
        columns = JSON.parse(columns)
        template = template.replaceAll('!-', '{{').replaceAll('-!', '}}')

        this.data('grid', new GridComponent(this, columns, template))
    }

}(jQuery));


class GridComponent {

    /**
     * @type {JQuery<HTMLElement>}
     */
    $table

    /**
     * @type { { Field: string, Type: string }[] }
     */
    columns


    constructor(table, columns, template) {
        this.columns = columns
        this.$table = table
        this.data = []

        this.rowTemplate = ExecutableInsert.Template.compile(template)
    }

    load(data) {
        this.data.push(...data)

        const rows = ExecutableInsert.Template.render(this.rowTemplate, { data })

        this.$table.find('tbody').append(rows)
    }

    format() {

    }

    calculateTotals() {

    }

    sort() {

    }

    filter() {

    }


}
