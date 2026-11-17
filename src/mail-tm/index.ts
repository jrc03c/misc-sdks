import { authenticate } from "./methods/authenticate.mjs"
import { BaseClient } from "../base/index.mjs"
import { createAccount } from "./methods/create-account.mjs"
import { deleteAccount } from "./methods/delete-account.mjs"
import { deleteMessage } from "./methods/delete-message.mjs"
import { getAccountInfo } from "./methods/get-account-info.mjs"
import { getDomains } from "./methods/get-domains.mjs"
import { getMessage } from "./methods/get-message.mjs"
import { getMessages } from "./methods/get-messages.mjs"
import { MailTmClientResponse } from "./response.mjs"

const BASE_URL = "https://api.mail.tm"

class MailTmClient extends BaseClient {
  #address = ""
  #id = ""
  #password = ""

  token = ""

  constructor(data) {
    data = data || {}
    data.baseUrl = data.baseUrl || BASE_URL

    super(data)

    this.address = data.address || this.address
    this.id = data.id || this.id
    this.password = data.password || this.password
    this.token = data.token || this.token
  }

  get address() {
    return this.#address
  }

  set address(v) {
    if (this.#address) {
      throw new Error(
        "The `MailTmClient.address` property can only be set once! To use a different account, please create a new `MailTmClient` instance.",
      )
    }

    this.#address = v
  }

  get id() {
    return this.#id
  }

  set id(v) {
    if (this.#id) {
      throw new Error(
        "The `MailTmClient.id` property can only be set once! To use a different account, please create a new `MailTmClient` instance.",
      )
    }

    this.#id = v
  }

  get password() {
    return this.#password
  }

  set password(v) {
    if (this.#password) {
      throw new Error(
        "The `MailTmClient.password` property can only be set once! To use a different account, please create a new `MailTmClient` instance.",
      )
    }

    this.#password = v
  }

  authenticate() {
    return authenticate(this, ...arguments)
  }

  createAccount() {
    return createAccount(this, ...arguments)
  }

  deleteAccount() {
    return deleteAccount(this, ...arguments)
  }

  deleteMessage() {
    return deleteMessage(this, ...arguments)
  }

  getAccountInfo() {
    return getAccountInfo(this, ...arguments)
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

  async send(path, options, shouldAuthenticate) {
    shouldAuthenticate = shouldAuthenticate ?? true

    if (shouldAuthenticate && !this.token) {
      const authResponse = await this.authenticate()

      if (authResponse.status >= 400) {
        return authResponse
      }
    }

    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (shouldAuthenticate && !options.headers["Authorization"]) {
      options.headers["Authorization"] = `Bearer ${this.token}`
    }

    return new MailTmClientResponse(await super.send(path, options))
  }
}

export { MailTmClient, MailTmClientResponse }
