import { BaseClient } from "../base-client/index.mjs"
import { getListInfo } from "./methods/get-list-info.mjs"
import { MailchimpClientResponse } from "./response.mjs"

class MailchimpClient extends BaseClient {
  apiKey = ""
  apiVersion = "3.0"
  datacenter = "us0"

  constructor(data) {
    data = data || {}
    super(data)

    if (!data.apiKey) {
      throw new Error(
        "The object passed into the `MailchimpClient` constructor must have an 'apiKey' property with a string value representing a valid Mailchimp API key!",
      )
    }

    this.apiKey = data.apiKey
    this.apiVersion = data.apiVersion || this.apiVersion
    this.datacenter = data.datacenter || this.apiKey.split("-").at(-1).trim()

    this.baseUrl =
      data.baseUrl ||
      `https://${this.datacenter}.api.mailchimp.com/${this.apiVersion}`

    // bind methods
    this.getListInfo = getListInfo.bind(this)
  }

  ping() {
    return this.get("/ping")
  }

  async send(path, options) {
    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers["Authorization"]) {
      options.headers["Authorization"] =
        `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString("base64")}`
    }

    return new MailchimpClientResponse(await super.send(path, options))
  }
}

export { MailchimpClient }
