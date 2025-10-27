import { createRecord } from "./methods/create-record.mjs"
import { createRecords } from "./methods/create-records.mjs"
import { getRecord } from "./methods/get-record.mjs"
import { getRecords } from "./methods/get-records.mjs"
import { updateRecordDestructively } from "./methods/update-record-destructively.mjs"
import { updateRecordSafely } from "./methods/update-record-safely.mjs"
import { updateRecordsDestructively } from "./methods/update-records-destructively.mjs"
import { updateRecordsSafely } from "./methods/update-records-safely.mjs"

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
    this.createRecord = createRecord.bind(this)
    this.createRecords = createRecords.bind(this)
    this.getRecord = getRecord.bind(this)
    this.getRecords = getRecords.bind(this)
    this.updateRecordDestructively = updateRecordDestructively.bind(this)
    this.updateRecordSafely = updateRecordSafely.bind(this)
    this.updateRecordsDestructively = updateRecordsDestructively.bind(this)
    this.updateRecordsSafely = updateRecordsSafely.bind(this)
  }
}

export { AirtableTable }
