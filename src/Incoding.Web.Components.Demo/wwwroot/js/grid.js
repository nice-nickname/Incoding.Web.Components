
// columns -> { Prop: <>, Type: <> }[]

(function ($) {

    $.fn.gridComponent = function (columns, template, nestedTemplate) {
        columns = JSON.parse(columns)
        template = template.replaceAll('!-', '{{').replaceAll('-!', '}}')

        this.data('grid', new GridComponent(this, columns, template, nestedTemplate))
    }

}(jQuery));


class GridComponent {

    static formatProvider = {
        ['Numeric']: (val) => { },
        ['DateTime']: () => { },
        ['Currency']: () => { },
        ['Percentage']: () => { }
    }

    /**
     * @type {JQuery<HTMLElement>}
     */
    $table

    /**
     * @type {HTMLTableRowElement[]}
     */
    rows

    /**
     * @type { { Field: string, Type: string }[] }
     */
    columns


    constructor(
        table,
        columns,
        template,
        nestedTemplate
    ) {
        this.columns = columns
        this.$table = table
        this.rows = []
        this.data = []

        this.rowTemplate = ExecutableInsert.Template.compile(template)
    }

    load(data) {
        this.data.push(...data)

        this.renderRows(data)
    }

    renderRows(data) {
        const htmlString = ExecutableInsert.Template.render(this.rowTemplate, { data })

        const template = document.createElement('template')
        template.innerHTML = htmlString

        let $rows = $(template.content.children)

        this.$table.find('tbody')[0].appendChild(template.content)

        this.format($rows)

        IncodingEngine.Current.parse($rows)

        //this.$table.find('tbody')[0].insertAdjacentHTML("beforeend", htmlString)

        //this.format(this.$table)

        //IncodingEngine.Current.parse($rows)
    }

    reload(data) {

    }

    _reload(index, data) {
        const changes = []
        const htmlString = ExecutableInsert.Template.render(this.rowTemplate, { data })

        const template = document.createElement('template')
        template.innerHTML = htmlString

        let newRow = template.content.children[0]
        let oldRow = this.$table.children('tbody').children('tr').eq(index)[0]

        const hasNewNested = template.content.children.length == 2
        const hasOldNested = this.$table.children('tbody').children('tr').eq(index + 1).is('.nested')

        morphdom(oldRow, newRow, {
            childrenOnly: true
        })

        changes.push(oldRow)

        if (hasNewNested && hasOldNested) {
            newRow = template.content.children[1]
            oldRow = this.$table.children('tbody').children('tr').eq(index + 1)[0]

            morphdom(oldRow, newRow, {
                childrenOnly: true
            })

            changes.push(oldRow)
        }
        else if (hasOldNested) {
            this.$table.children('tbody').children('tr').eq(index + 1).detach()
        }
        else if (hasNewNested) {
            newRow = template.content.children[1]
            newRow.parentElement.insertBefore(newRow, oldRow.nextSibling)

            changes.push(oldRow)
        }

        this.format($(changes))
    }

    format($context) {
        $context.find('td[data-format]').each(function() {
            const format = this.dataset.format
            const value = this.textContent

            const formatProvider = GridComponent.formatProvider[format]

            if (formatProvider) {
                this.textContent = formatProvider(value, this)
            }

            this.removeAttribute('data-format')
        })
    }

    calculateTotals() {

    }

    sort() {

    }

    filter() {

    }
}


GridComponent.formatProvider.Numeric = (value, holder) => {
    let numericValue = Number(value)

    if (isNaN(numericValue)) {
        numericValue = 0
    }

    if (numericValue < 0) {
        numericValue = -numericValue

        holder.classList.add('negative-number')
        holder.classList.remove('positive-number')
        return `(${numericValue.toFixed(2)})`
    }

    holder.classList.remove('positive-number')
    return numericValue.toFixed(2)
}

GridComponent.formatProvider.Percentage = (value, holder) => {
    return GridComponent.formatProvider.Numeric(value, holder) + '%'
}

GridComponent.formatProvider.Currency = (value, holder) => {
    return '$' + GridComponent.formatProvider.Numeric(value, holder)
}

GridComponent.formatProvider.DateTime = (value, holder) => {
    const dateValue = new Date(value)

    if (isNaN(dateValue)) {
        return ''
    }

    return dateValue.toDateString()
}
