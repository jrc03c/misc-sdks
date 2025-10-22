import { BaseClientResponse } from "./response.mjs"
import { safeParse } from "./utils.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

class BaseClient {
  baseUrl = ""

  constructor(data) {
    data = data || {}
    this.baseUrl = data.baseUrl || this.baseUrl
  }

  delete() {}

  get() {}

  head() {}

  options() {}

  patch() {}

  post() {}

  put() {}

  async send(path, options) {
    options = options || {}
    const url = urlPathJoin(this.baseUrl, path)
    const response = await fetch(url, options)
    const raw = await response.text()
    const data = safeParse(raw)

    return new BaseClientResponse({
      data,
      endpoint: url,
      raw,
      status: response.status,
    })
  }

  trace() {}
}

export { BaseClient }
