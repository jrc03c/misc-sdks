class BaseClientResponse {
  data = null
  endpoint = ""
  raw = ""
  status = 0

  constructor(data) {
    data = data || {}
    this.data = data.data || this.data
    this.endpoint = data.endpoint || this.endpoint
    this.raw = data.raw || this.raw
    this.status = data.status || this.status
  }
}

export { BaseClientResponse }
