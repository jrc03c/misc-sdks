class BaseClientResponse {
  endpoint = ""
  json = null
  method = ""
  status = 0
  text = ""

  constructor(data) {
    data = data || {}
    this.endpoint = data.endpoint ?? this.endpoint
    this.json = data.json ?? this.json
    this.method = data.method ?? this.method
    this.status = data.status ?? this.status
    this.text = data.text ?? this.text
  }

  get data() {
    return this.json
  }

  set data(v) {
    this.json = v
  }

  get raw() {
    return this.text
  }

  set raw(v) {
    this.text = v
  }
}

export { BaseClientResponse }
