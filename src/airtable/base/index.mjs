import { AirtableTable } from "../table/index.mjs"
import { getTableSchema } from "./methods/get-table-schema.mjs"
import { getTableSchemas } from "./methods/get-table-schemas.mjs"

class AirtableBase {
  client = null
  id = null

  constructor(data) {
    data = data || {}

    if (!data.client) {
      throw new Error(
        "The object passed into the `AirtableBase` constructor must have a 'client' property that points to an `AirtableClient` instance!",
      )
    }

    if (!data.id) {
      throw new Error(
        "The object passed into the `AirtableBase` constructor must have an 'id' property with a string value representing the ID of an Airtable base!",
      )
    }

    this.client = data.client
    this.id = data.id

    // methods
    this.getTableSchema = getTableSchema.bind(this)
    this.getTableSchemas = getTableSchemas.bind(this)
  }

  getTableRef(id) {
    return new AirtableTable({
      base: this,
      client: this.client,
      id,
    })
  }
}

export { AirtableBase }
