import { BaseClient } from "../base/index.mjs"
import { MailgunClientResponse } from "./response.mjs"
import { MailgunEmailPayload } from "./email-payload.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

const MAILGUN_BASE_URL = "https://api.mailgun.net"

class MailgunClient extends BaseClient {
  apiKey = null
  apiVersion = 3
  senderDomain = null

  constructor(data) {
    data = data || {}
    super(data)

    if (!data.apiKey) {
      throw new Error(
        "The object passed into the `MailgunClient` constructor must have an 'apiKey' property with a string value representing a valid Mailgun API key!",
      )
    }

    if (!data.senderDomain) {
      throw new Error(
        "The object passed into the `MailgunClient` constructor must have an 'senderDomain' property with a string value corresponding to the sender domain defined in your Mailgun account settings!",
      )
    }

    this.apiKey = data.apiKey
    this.apiVersion = data.apiVersion || this.apiVersion
    this.senderDomain = data.senderDomain

    this.baseUrl =
      data.baseUrl || urlPathJoin(MAILGUN_BASE_URL, "/v" + this.apiVersion)
  }

  async send(path, options) {
    if (
      arguments.length === 1 &&
      MailgunEmailPayload.isPayloadish(arguments[0])
    ) {
      throw new Error(
        "It looks like you called the `MailgunClient.send` method when you meant instead to call the `MailgunClient.sendEmail` method! (The former is a lower-level utility method for making literal HTTP requests.)",
      )
    }

    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers["Authorization"]) {
      options.headers["Authorization"] =
        `Basic ${Buffer.from(`api:${this.apiKey}`).toString("base64")}`
    }

    return new MailgunClientResponse(await super.send(path, options))
  }

  async sendEmail(payload) {
    if (!MailgunEmailPayload.isPayloadish(payload)) {
      throw new Error(
        "The object passed into the `MailgunClient.sendEmail` method must either be (1) a `MailgunEmailPayload` instance or (2) an object that has (at a minimum) 'to' and 'subject' properties with string values representing, respectively, a recipient email address and a subject line!",
      )
    }

    if (!(payload instanceof MailgunEmailPayload)) {
      payload = new MailgunEmailPayload(payload)
    }

    if (!payload.from) {
      payload.from = `noreply@${this.senderDomain}`
    }

    return await this.post(urlPathJoin("/", this.senderDomain, "messages"), {
      body: payload.toFormData(),
    })
  }
}

export { MailgunClient, MailgunClientResponse, MailgunEmailPayload }
