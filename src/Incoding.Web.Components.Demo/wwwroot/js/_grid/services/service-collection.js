
class ServiceCollection {

    constructor() {
        this.services = { }
    }

    register(key, serviceInstance) {
        this.services[key] = serviceInstance
    }

    get(key) {
        return this.services[key] || null
    }
}
