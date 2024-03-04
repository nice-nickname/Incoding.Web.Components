class AtOnceRenderer {

    /**
     * @type { SplitGridController }
     */
    splitGrid;

    /**
     * @type { number }
     */
    dataLength;

    constructor(splitGrid) {
        this.splitGrid = splitGrid;
        this.dataLength = 0;

        this.handleDataUpdated()
    }

    handleDataUpdated() {
        const newDataLength = this.splitGrid.data.length;

        this.splitGrid.renderRows(this.dataLength, newDataLength);

        this.dataLength = newDataLength;
    }
}
