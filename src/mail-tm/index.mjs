import { BaseClient } from "../base/index.mjs"
import { MailTmClientResponse } from "./response.mjs"
import { safeParse } from "../base/utils.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

const BASE_URL = "https://api.mail.tm"

class MailTmClient extends BaseClient {
  address = ""
  password = ""
  token = ""

  constructor(data) {
    data = data || {}
    data.baseUrl = data.baseUrl || BASE_URL

    super(data)

    this.address = data.address || this.address
    this.password = data.password || this.password
    this.token = data.token || this.token

    if (!this.address || typeof this.address !== "string") {
      throw new Error(
        "The object passed into the `MailTmClient` constructor must have an 'address' property with a string value representing an email address!",
      )
    }

    if (!this.password || typeof this.password !== "string") {
      throw new Error(
        "The object passed into the `MailTmClient` constructor must have a 'password' property with a string value!",
      )
    }
  }

  get apiToken() {
    return this.token
  }

  set apiToken(v) {
    this.token = v
  }

  async authenticate() {
    const url = urlPathJoin(this.baseUrl, "/token")

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: this.address,
        password: this.password,
      }),
    })

    const raw = await response.text()
    const data = safeParse(raw)

    const out = new MailTmClientResponse({
      endpoint: url,
      json: data,
      method: "POST",
      status: response.status,
      text: raw,
    })

    if (out.status >= 200 && out.status <= 204) {
      this.token = data.token
    }

    return out
  }

  deleteMessage(id) {
    if (typeof id !== "string") {
      throw new Error(
        "The value passed into the `MailTmClient.deleteMessage` method must be a string representing a message ID!",
      )
    }

    return this.delete(`/messages/${id}`)
  }

  getMessages(page) {
    page = page ?? 1

    if (typeof page !== "number" || page < 1) {
      throw new Error(
        "The value passed into the `MailTmClient.getMessages` method must be a positive integer representing a page number!",
      )
    }

    return this.get(`/messages?page=${Math.floor(page)}`)
  }

  getMessage(id) {
    if (typeof id !== "string") {
      throw new Error(
        "The value passed into the `MailTmClient.getMessage` method must be a string representing a message ID!",
      )
    }

    return this.get(`/messages/${id}`)
  }

  async getTotalMessageCount() {
    const response = await this.get("/messages")

    if (response.status >= 200 && response.status <= 204) {
      const count = response.json["hydra:totalItems"] || 0

      return new MailTmClientResponse({
        ...response,
        json: count,
        text: count.toString(),
      })
    } else {
      return response
    }
  }

  async send(path, options) {
    if (!this.token) {
      const authResponse = await this.authenticate()

      if (authResponse.status >= 400) {
        return authResponse
      }
    }

    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers["Authorization"]) {
      options.headers["Authorization"] = `Bearer ${this.token}`
    }

    return new MailTmClientResponse(await super.send(path, options))
  }
}

export { MailTmClient, MailTmClientResponse }
