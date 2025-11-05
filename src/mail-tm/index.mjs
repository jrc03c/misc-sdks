import { authenticate } from "./methods/authenticate.mjs"
import { BaseClient } from "../base/index.mjs"
import { deleteMessage } from "./methods/delete-message.mjs"
import { getDomains } from "./methods/get-domains.mjs"
import { getMessage } from "./methods/get-message.mjs"
import { getMessages } from "./methods/get-messages.mjs"
import { MailTmClientResponse } from "./response.mjs"

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
  }

  get apiToken() {
    return this.token
  }

  set apiToken(v) {
    this.token = v
  }

  authenticate() {
    return authenticate(this, ...arguments)
  }

  deleteMessage() {
    return deleteMessage(this, ...arguments)
  }

  getDomains() {
    return getDomains(this, ...arguments)
  }

  getMessage() {
    return getMessage(this, ...arguments)
  }

  getMessages() {
    return getMessages(this, ...arguments)
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
