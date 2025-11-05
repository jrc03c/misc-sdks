import { BaseClientResponse } from "./response.mjs"
import { ExponentialBackoffHelper } from "@jrc03c/exponential-backoff"
import { safeParse } from "./utils.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

class BaseClient {
  baseUrl = ""
  exponentialBackoffHelper = null

  constructor(data) {
    data = data || {}
    this.baseUrl = data.baseUrl || this.baseUrl

    this.exponentialBackoffHelper =
      data.exponentialBackoffHelper || new ExponentialBackoffHelper()

    if (!this.baseUrl || typeof this.baseUrl !== "string") {
      throw new Error(
        "The options object passed into the `BaseClient` constructor must have a 'baseUrl' property with a string value representing a core URL to which endpoint paths will be appended!",
      )
    }
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

    if (typeof path !== "string") {
      throw new Error(
        "The first argument passed into the `BaseClient.send` method must be a string representing an API endpoint path!",
      )
    }

    if (typeof options !== "object") {
      throw new Error(
        "The second argument passed into the `BaseClient.send` method must be null, undefined, or an options object (i.e., of the type normally passed as the second argument to `fetch`)!",
      )
    }

    const url = urlPathJoin(this.baseUrl, path)
    let response
    let wasSuccessful = false

    while (!wasSuccessful) {
      await this.exponentialBackoffHelper.exec(async () => {
        response = await fetch(url, options)
        wasSuccessful = response.status !== 429
        return wasSuccessful
      })
    }

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
}

export { BaseClient, BaseClientResponse }
