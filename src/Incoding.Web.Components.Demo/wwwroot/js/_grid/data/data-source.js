
class DataSource {

    /** @type { boolean } */
    isDataLoading = false

    /** @type { object[] } */
    #data

    /** @type { object[] } */
    #visibleData

    constructor(data = []) {
        this.#data = data
        this.#visibleData = data
    }

    appendData(data) {
        this.#data.push(...data)
    }

    getInitialData() {
        return this.#data
    }

    getData() {
        return this.#visibleData
    }

    setData(data) {
        this.#visibleData = data
    }

    reset() {
        this.#visibleData = this.#data
    }

    clear() {
        this.#data = []
        this.#visibleData = this.#data
    }

}
