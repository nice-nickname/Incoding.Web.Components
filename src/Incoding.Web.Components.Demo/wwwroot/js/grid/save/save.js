
(function($) {

    $.fn.changeField = function() {
        const $input = $(this)
        const $cell = $input.closest('td')
        const $row = $input.closest('tr')
        const $table = $input.closest('table')

        const index = $cell.index()
        const id = $row.data('rowId')
        const value = $input.unmasked()

        const controller = $table.data('grid')

        const record = controller.data.find(s => s.RowId == id)

        const {
            field,
            spreadIndex,
            spreadField,
        } = controller.structure.columns[index]

        let fieldAccessor = (data, val) => data[field] = val

        if (!ExecutableHelper.IsNullOrEmpty(spreadField)) {
            fieldAccessor = (data, val) => data[spreadField][spreadIndex][field] = val
        }

        fieldAccessor(record, Number(value) || 0)

        controller.totals()
    }

} (jQuery));