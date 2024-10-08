
class DataSource {

    /**
     * @type { Object[] }
     */
    data;

    constructor(data) {
        this.data = data;
    }

    append(...data) {
        this.data.push(...data);
    }
}
