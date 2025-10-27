import { AirtableClientResponse } from "./response.mjs"
import { AirtableBase } from "./airtable-base.mjs"
import { BaseClient } from "../base/index.mjs"

class AirtableClient extends BaseClient {
  token = null

  constructor(data) {
    data = data || {}
    super(data)

    if (!data.token) {
      throw new Error(
        "The object passed into the `AirtableClient` constructor must have a 'token' property with a string value corresponding to a valid Airtable authentication token!",
      )
    }

    this.baseUrl = data.baseUrl || "https://api.airtable.com/v0"
    this.token = data.token
  }

  getBase(id) {
    return new AirtableBase({
      client: this,
      id,
    })
  }
}

export { AirtableClient, AirtableClientResponse }
