
Handlebars.registerHelper("json", function(data) {
    const json = JSON.stringify(data)
    return _.escape(json)
})
