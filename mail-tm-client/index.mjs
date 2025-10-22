import { ExponentialBackoffHelper } from "@jrc03c/exponential-backoff"
import { MailTmClientResponse } from "./response.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

const BASE_URL = "https://api.mail.tm"

function safeParse(x) {
  try {
    return JSON.parse(x)
  } catch (e) {
    return x
  }
}

class MailTmClient {
  backoff = new ExponentialBackoffHelper()
  id = null
  token = null

  constructor(data) {
    data = data || {}
    this.id = data.id || this.id
    this.token = data.token || this.token
  }

  async authenticate(address, password) {
    const url = urlPathJoin(BASE_URL, "/token")

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        password,
      }),
    })

    const raw = await response.text()
    const data = safeParse(raw)

    if (response.status >= 200 && response.status <= 204) {
      this.id = data.id
      this.token = data.token
    }

    return new MailTmClientResponse({
      data,
      method: "POST",
      path: "/token",
      status: response.status,
    })
  }

  async deleteAllMessages() {}

  deleteMessage(id) {
    return this.fetch(`/messages/${id}`, {
      method: "DELETE",
    })
  }

  async fetch(path, options) {
    if (!this.token) {
      throw new Error(
        "The `MailTmClient` instance has not yet been authenticated! Please call its `authenticate` method before calling its other methods.",
      )
    }

    options = options || {}

    if (typeof options.headers === "undefined") {
      options.headers = {}
    }

    if (typeof options.headers["Authorization"] === "undefined") {
      options.headers["Authorization"] = `Bearer ${this.token}`
    }

    const url = urlPathJoin(BASE_URL, path)
    let response

    await this.backoff.exec(async () => {
      response = await fetch(url, options)
      return response.status !== 429
    })

    const raw = await response.text()
    const data = safeParse(raw)

    return new MailTmClientResponse({
      data,
      method: options.method || "GET",
      path,
      status: response.status,
    })
  }

  getAllMessages() {}

  getMessage(id) {
    return this.fetch(`/messages/${id}`)
  }
}

export { MailTmClient }
