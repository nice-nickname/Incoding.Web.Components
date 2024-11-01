
class ServiceCollection {

    #services = new Map()

    register(key, service) {
        this.#services.set(key, service)
    }

    getService(key) {
        return this.#services.get(key)
    }
}
