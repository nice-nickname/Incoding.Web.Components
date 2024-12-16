
class SplitTable {

    /**
     * @type { DataSource }
     */
    dataSource


    /**
     * @type { TablePanelModel[] }
     */
    schemaModel

    /**
     * @type { HTMLElement[] }
     */
    panels


    /**
     *  @type { ServiceCollection }
     */
    services

    /**
     * @type { SplitTablePanel[] }
     */
    tables

    constructor(dataSource, schemaModel, panels, services) {
        this.dataSource = dataSource
        this.schemaModel = schemaModel
        this.panels = panels
        this.services = services
        this.tables = []
    }

    render() {
        for (let i = 0; i < this.schemaModel.length; i++) {
            const model = this.schemaModel[i]
            const panel = this.panels[i]

            const table = new SplitTablePanel(this, model)
            table.render()

            panel.append(table.getRootElement())
            this.tables.push(table)
        }
    }

    destroy() {
        for (const table of this.tables) {
            table.destroy()
        }
    }

}
