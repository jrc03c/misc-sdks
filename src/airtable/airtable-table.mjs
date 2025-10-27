import { getRecord } from "./methods/get-record.mjs"
import { getRecords } from "./methods/get-records.mjs"
import { updateRecords } from "./methods/update-records.mjs"
import { updateRecordsDestructively } from "./methods/update-records-destructively.mjs"

class AirtableTable {
  base = null
  client = null
  id = null

  constructor(data) {
    data = data || {}

    if (!data.base) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have a 'base' property pointing to an `AirtableBase` instance!",
      )
    }

    if (!data.client) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have a 'client' property pointing to an `AirtableClient` instance!",
      )
    }

    if (!data.id) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have an 'id' property with a string value representing the ID of an Airtable table!",
      )
    }

    this.base = data.base
    this.client = data.client
    this.id = data.id

    // methods
    this.getRecord = getRecord.bind(this)
    this.getRecords = getRecords.bind(this)
    this.updateRecords = updateRecords.bind(this)
    this.updateRecordsDestructively = updateRecordsDestructively.bind(this)
  }
}

export { AirtableTable }
