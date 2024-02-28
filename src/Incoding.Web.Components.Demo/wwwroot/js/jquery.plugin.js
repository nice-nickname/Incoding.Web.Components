(function($) {

    /**
     * Split grid control initialization point
     * called once on component first render
     */

    $.fn.splitGrid = function(schemas, options = "{}") {
        schemas = JSON.parse(schemas)
        options = JSON.parse(options)

        schemas.forEach(prepareSchema);

        const splitGrid = new SplitGridController(this, schemas, options)

        return this.data('splitGrid', splitGrid)
    }

    function prepareSchema(schema) {
        const rowTmpl = decodeRowTemplate(schema.RowTemplate)

        schema.RowTemplate = ExecutableInsert.Template.compile(rowTmpl)
        schema.ContentHtml = ExecutableInsert.Template.compile(schema.ContentHtml)

        if (schema.NestedTable) {
            prepareSchema(schema.NestedTable)
        }
    }

    function decodeRowTemplate(tmpl) {
        return tmpl.replaceAll('!-', '{{').replaceAll('-!', '}}')
    }

} (jQuery))
