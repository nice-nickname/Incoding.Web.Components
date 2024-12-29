
class DataSource {

    /** @type { boolean } */
    isDataLoading = false

    /** @type { object[] } */
    #data

    constructor(data = []) {
        this.#data = data
    }

    setData(data) {
        this.#data = data
    }

    getData() {
        return this.#data
    }

    appendData(data) {
        this.#data.push(...data)
    }

    clear() {
        this.#data = []
    }

}
