
class DataSource {

    /**
     * @type { Object[] }
     */
    data;

    constructor() {
        this.data = []
    }

    append(...data) {
        this.data.push(...data);
    }
}
