
Handlebars.registerHelper("escapedJson", function(data) {
    const json = JSON.stringify(data)
    return _.escape(json)
})
