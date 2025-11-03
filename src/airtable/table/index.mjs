import { createRecord } from "./methods/create-record.mjs"
import { createRecords } from "./methods/create-records.mjs"
import { deleteRecord } from "./methods/delete-record.mjs"
import { deleteRecords } from "./methods/delete-records.mjs"
import { getRecord } from "./methods/get-record.mjs"
import { getRecords } from "./methods/get-records.mjs"
import { getSchema } from "./methods/get-schema.mjs"
import { updateRecordDestructively } from "./methods/update-record-destructively.mjs"
import { updateRecordSafely } from "./methods/update-record-safely.mjs"
import { updateRecordsCore } from "./methods/update-records-core.mjs"
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
  }

  createRecord() {
    return createRecord(this, ...arguments)
  }

  createRecords() {
    return createRecords(this, ...arguments)
  }

  deleteRecord() {
    return deleteRecord(this, ...arguments)
  }

  deleteRecords() {
    return deleteRecords(this, ...arguments)
  }

  getRecord() {
    return getRecord(this, ...arguments)
  }

  getRecords() {
    return getRecords(this, ...arguments)
  }

  getSchema() {
    return getSchema(this, ...arguments)
  }

  updateRecordDestructively() {
    return updateRecordDestructively(this, ...arguments)
  }

  updateRecordSafely() {
    return updateRecordSafely(this, ...arguments)
  }

  updateRecordsCore() {
    return updateRecordsCore(this, ...arguments)
  }

  updateRecordsDestructively() {
    return updateRecordsDestructively(this, ...arguments)
  }

  updateRecordsSafely() {
    return updateRecordsSafely(this, ...arguments)
  }
}

export { AirtableTable }
