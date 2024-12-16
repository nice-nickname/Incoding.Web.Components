
class DataSource {

    /** @type { boolean } */
    isDataLoading = false

    /** @type { object[] } */
    #data

    /** @type { object[] } */
    #visibleData


    constructor() {
        this.#data = []
        this.#visibleData = []
    }

    getData() {
        return this.#visibleData
    }

    appendData(data) {
        this.#data.push(...data)
    }

    clearData() {
        this.#data = []
        this.#visibleData = []
    }

}
