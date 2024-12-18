
class DataSource {

    /** @type { boolean } */
    isDataLoading = false

    /** @type { object[] } */
    #data

    /** @type { object[] } */
    #visibleData


    constructor(data = []) {
        this.#data = data
        this.#visibleData = [...data]
    }

    getData() {
        return this.#data
    }

    appendData(data) {
        this.#data.push(...data)
    }

    clear() {
        this.#data = []
        this.#visibleData = []
    }

}
