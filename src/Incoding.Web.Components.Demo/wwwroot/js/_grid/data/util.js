
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
            const values = data.map(i => DataUtil.getValue(i, field))
            return Math.min(...values)
        },

        max: (data, field) => {
            const values = data.map(i => DataUtil.getValue(i, field))
            return Math.max(...values)
        },

        count: (data, field) => {
            return data.length
        }
    }

    /**
     * @param { object } obj
     * @param { string } field
     */
    static getValue(obj, field) {
        return field.split('.').reduce((acc, field) => acc && acc[field], obj) || 0;
    }
}

class AggregateUtil {

    /**
     * @param { object[] } data
     * @param { string } formula
     */
    static executeFormula(data, formula) {
        const entries = this.#parseFormula(formula)
        const values = this.#executeAggregate(data, entries)

        for (const { argument, operation } of entries) {
            const value = values[argument]
            formula = formula.replace(operation, value)
        }

        return eval(formula)
    }

    /**
     * @param { string } formula
     */
    static #parseFormula(formula) {
        const operationRegex = /(SUM|AVERAGE|MIN|MAX|COUNT)\((.*?)\)/gm

        const result = []

        for (const operation of formula.match(operationRegex)) {
            const operator = operation.slice(0, operation.indexOf('(')).toLowerCase()
            const argument = operation.slice(
                operation.indexOf('(') + 1,
                operation.indexOf(')')
            )

            result.push({ operator, argument, operation })
        }

        return result
    }

    /**
     * @param { object[] } data
     * @param { any[] } entries
     */
    static #executeAggregate(data, entries) {
        const values = { }

        for (const { argument, operator } of entries) {
            values[argument] = DataUtil.aggregate(data, argument, operator)
        }

        return values
    }
}
