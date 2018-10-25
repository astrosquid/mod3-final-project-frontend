class Adapter {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  getIndex() {
    return fetch(this.endpoint)
  }
}
