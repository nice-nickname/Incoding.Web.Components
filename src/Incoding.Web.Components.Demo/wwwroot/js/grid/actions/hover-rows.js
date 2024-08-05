
class HoverRowsController {

    /**
     * @type { TableController }
     */
    table

    constructor(table) {
        this.table = table

        let prevRowIndex = -1

        this.table.$body[0].addEventListener('mouseover', (event) => {
            event.stopPropagation()

            const $row = $(event.target).closest('tr')

            const rowIndex = $row.index()
            const isNeedHighlight = $row.is('[body-row]')

            this.table.parent.siblings.forEach(table => {
                const $rows = table.$body.children()

                const $prev = $rows.eq(prevRowIndex)
                const $current = $rows.eq(rowIndex)

                $prev.removeClass(classes.highlight)

                if (isNeedHighlight) {
                    $current.addClass(classes.highlight)
                }
            })

            prevRowIndex = rowIndex
        })

        this.table.$body[0].addEventListener('mouseleave', (event) => {
            event.stopPropagation()

            this.table.parent.siblings.forEach(table => {
                const $rows = table.$body.children()

                $rows.removeClass('highlight')
            })
        })
    }
}
