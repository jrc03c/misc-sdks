interface BaseClientResponseData {
  endpoint?: string
  json?: object | null | undefined
  method?: string
  status?: number
  text?: string
}

class BaseClientResponse {
  endpoint = ""
  json: object | null | undefined = null
  method = ""
  status = 0
  text = ""

  constructor(data: BaseClientResponseData = {}) {
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

export { BaseClientResponse, BaseClientResponseData }
