class Adapter {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  get() {
    return fetch(this.endpoint)
  }

  new(requestBody) {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(requestBody)
    })
  }
}
