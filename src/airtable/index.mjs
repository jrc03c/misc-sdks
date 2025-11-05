import { AirtableBaseRef } from "./base-ref/index.mjs"
import { AirtableClientResponse } from "./response.mjs"
import { AirtableTableRef } from "./table-ref/index.mjs"
import { BaseClient } from "../base/index.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

const AIRTABLE_BASE_URL = "https://api.airtable.com"
const AIRTABLE_MAX_REQUESTS_PER_SECOND = 50

class AirtableClient extends BaseClient {
  apiVersion = 0
  token = null

  constructor(data) {
    data = data || {}
    super(data)

    data.token = data.token || data.apiToken

    if (!data.token || typeof data.token !== "string") {
      throw new Error(
        "The object passed into the `AirtableClient` constructor must have a 'token' property with a string value corresponding to a valid Airtable authentication token!",
      )
    }

    this.apiVersion = data.apiVersion || this.apiVersion

    this.baseUrl =
      data.baseUrl || urlPathJoin(AIRTABLE_BASE_URL, "v" + this.apiVersion)

    this.exponentialBackoffHelper.ms = 1000 / AIRTABLE_MAX_REQUESTS_PER_SECOND
    this.token = data.token
  }

  get apiToken() {
    return this.token
  }

  set apiToken(v) {
    this.token = v
  }

  getBaseRef(id) {
    if (typeof id !== "string") {
      throw new Error(
        "The value passed into the `AirtableClient.getBaseRef` method must be a string representing a base ID!",
      )
    }

    return new AirtableBaseRef({
      client: this,
      id,
    })
  }

  async send(path, options) {
    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers["Authorization"]) {
      options.headers["Authorization"] = `Bearer ${this.token}`
    }

    return new AirtableClientResponse(await super.send(path, options))
  }
}

export {
  AirtableBaseRef,
  AirtableClient,
  AirtableClientResponse,
  AirtableTableRef,
}
