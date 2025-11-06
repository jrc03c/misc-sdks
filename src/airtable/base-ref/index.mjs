import { AirtableTableRef } from "../table-ref/index.mjs"
import { getTableSchema } from "./methods/get-table-schema.mjs"
import { getTableSchemas } from "./methods/get-table-schemas.mjs"

class AirtableBaseRef {
  client = null
  id = null

  constructor(data) {
    data = data || {}

    if (!data.client) {
      throw new Error(
        "The object passed into the `AirtableBaseRef` constructor must have a 'client' property that points to an `AirtableClient` instance!",
      )
    }

    if (!data.id) {
      throw new Error(
        "The object passed into the `AirtableBaseRef` constructor must have an 'id' property with a string value representing the ID of an Airtable base!",
      )
    }

    this.client = data.client
    this.id = data.id
  }

  getTableRef(id) {
    if (typeof id !== "string") {
      throw new Error(
        "The value passed into the `AirtableBaseRef.getTableRef` method must be a string representing a table ID!",
      )
    }

    return new AirtableTableRef({
      baseRef: this,
      client: this.client,
      id,
    })
  }

  getTableSchema() {
    return getTableSchema(this, ...arguments)
  }

  getTableSchemas() {
    return getTableSchemas(this, ...arguments)
  }
}

export { AirtableBaseRef }
