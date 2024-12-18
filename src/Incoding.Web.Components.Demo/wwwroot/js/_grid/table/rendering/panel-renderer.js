
class TablePanelRendererBase {

    /**
     * @type { SplitTable }
     */
    parent

    /**
     * @type { HTMLElement[] }
     */
    elements

    /**
     * @type { HTMLTableElement[] }
     */
    tables

    constructor(parent) {
        this.parent = parent;
        this.elements = []
        this.tables = []
    }

    renderPanels(panelContainers, css, tag, property) {
        for (let i = 0; i < this.parent.schemaModel.length; i++) {
            const panelModel = this.parent.schemaModel[i]

            const panel = document.createElement('div')
            panel.classList.add(css)

            const table = document.createElement('table')
            table.className = panelModel.css
            table.classList.add(classes.splitTable)

            const panelContentTag = document.createElement(tag)

            table.append(panelContentTag)
            panel.append(table)

            this.tables.push(table)
            this.elements.push(panel)
            this[property].push(panelContentTag)

            const container = panelContainers[i]
            container.append(panel)
        }
    }

}
