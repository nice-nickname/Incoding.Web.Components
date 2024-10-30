
class DataUtil {


    /**
     * @param { object[] } data
     * @param { string } field
     * @param { Aggregate } aggregateFn
     */
    static aggregate(data, field, aggregateFn) {
        return DataUtil.aggregates[aggregateFn](data, field)
    }

    /**
     * @type { {
     *  [key: string]: (data: object[], field: string) => number
     * } }
     */
    static aggregates = {
        sum: (data, field) => {
            return data.reduce((sum, item) =>
                sum += DataUtil.getValue(item, field), 0)
        },

        average: (data, field) => {
            return this.aggregates.sum(data, field) / data.length
        },

        min: (data, field) => {
            const numbers = data.map(i => DataUtil.getValue(i, field))
            return Math.min(...numbers)
        },

        max: (data, field) => {
            const numbers = data.map(i => DataUtil.getValue(i, field))
            return Math.max(...numbers)
        },

        count: (data, field) => {
            return data.length
        }
    }


    static getValue(obj, field) {
        return field.split('.').reduce((acc, part) => acc && acc[part], obj) || 0;
    }
}

class AggregateUtil {


    /**
     * @param { object[] } data
     * @param { string } formula
     */
    static executeFormula(data, formula) {
        const entries = this.parseFormula(formula)
        const executed = this.executeAggregate(data, entries)

        for (const { variable, operation } of entries) {
            const value = executed[variable]
            formula = formula.replace(operation, value)
        }

        return eval(formula)
    }

    /**
     * @param { string } formula
     */
    static parseFormula(formula) {
        const operationRegex = /(SUM|AVERAGE|MIN|MAX|COUNT)\((.*?)\)/gm

        const result = []

        for (const operation of formula.match(operationRegex)) {
            const operator = operation.slice(0, operation.indexOf('(')).toLowerCase()
            const variable = operation.slice(
                operation.indexOf('(') + 1,
                operation.indexOf(')')
            )

            result.push({ operator, variable, operation })
        }

        return result
    }

    /**
     * @param { object[] } data
     * @param { any[] } entries
     */
    static executeAggregate(data, entries) {
        const vars = { }

        for (const { variable, operator } of entries) {
            vars[variable] = DataUtil.aggregate(data, variable, operator)
        }

        return vars
    }
}
