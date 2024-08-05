
class ImmediateRowRenderer {

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

        this.restart()
    }

    handleDataUpdated() {
        const newDataLength = this.splitGrid.data.length;

        this.splitGrid.renderRows(this.dataLength, newDataLength);

        this.dataLength = newDataLength;
    }

    restart() {
        this.dataLength = 0
    }
}
