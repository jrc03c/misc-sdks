import { BaseClientResponse } from "./response.mjs"
import { safeParse } from "./utils.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

class BaseClient {
  baseUrl = ""

  constructor(data) {
    data = data || {}
    this.baseUrl = data.baseUrl || this.baseUrl
  }

  delete(path, options) {
    options = options || {}

    if (options.method !== "DELETE") {
      options.method = "DELETE"
    }

    return this.send(path, options)
  }

  get(path, options) {
    options = options || {}

    if (options.method !== "GET") {
      options.method = "GET"
    }

    return this.send(path, options)
  }

  head(path, options) {
    options = options || {}

    if (options.method !== "HEAD") {
      options.method = "HEAD"
    }

    return this.send(path, options)
  }

  options(path, options) {
    options = options || {}

    if (options.method !== "OPTIONS") {
      options.method = "OPTIONS"
    }

    return this.send(path, options)
  }

  patch(path, options) {
    options = options || {}

    if (options.method !== "PATCH") {
      options.method = "PATCH"
    }

    return this.send(path, options)
  }

  post(path, options) {
    options = options || {}

    if (options.method !== "POST") {
      options.method = "POST"
    }

    return this.send(path, options)
  }

  put(path, options) {
    options = options || {}

    if (options.method !== "PUT") {
      options.method = "PUT"
    }

    return this.send(path, options)
  }

  async send(path, options) {
    options = options || {}
    const url = urlPathJoin(this.baseUrl, path)
    const response = await fetch(url, options)
    const raw = await response.text()
    const data = safeParse(raw)

    return new BaseClientResponse({
      endpoint: url,
      json: data,
      method: options.method || "GET",
      status: response.status,
      text: raw,
    })
  }

  trace(path, options) {
    options = options || {}

    if (options.method !== "TRACE") {
      options.method = "TRACE"
    }

    return this.send(path, options)
  }
}

export { BaseClient }
