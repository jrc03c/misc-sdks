import { batchCreateRecords } from "./methods/batch-create-records.mjs"
import { batchDeleteRecords } from "./methods/batch-delete-records.mjs"
import { batchGetRecords } from "./methods/batch-get-records.mjs"
import { batchUpdateRecordsDestructively } from "./methods/batch-update-records-destructively.mjs"
import { batchUpdateRecordsSafely } from "./methods/batch-update-records-safely.mjs"
import { createRecords } from "./methods/create-records.mjs"
import { deleteRecords } from "./methods/delete-records.mjs"
import { getRecords } from "./methods/get-records.mjs"
import { getSchema } from "./methods/get-schema.mjs"
import { updateRecordsCore } from "./methods/update-records-core.mjs"
import { updateRecordsDestructively } from "./methods/update-records-destructively.mjs"
import { updateRecordsSafely } from "./methods/update-records-safely.mjs"

class AirtableTableRef {
  base = null
  client = null
  id = null

  constructor(data) {
    data = data || {}

    if (!data.base) {
      throw new Error(
        "The object passed into the `AirtableTableRef` constructor must have a 'base' property pointing to an `AirtableBase` instance!",
      )
    }

    if (!data.client) {
      throw new Error(
        "The object passed into the `AirtableTableRef` constructor must have a 'client' property pointing to an `AirtableClient` instance!",
      )
    }

    if (!data.id) {
      throw new Error(
        "The object passed into the `AirtableTableRef` constructor must have an 'id' property with a string value representing the ID of an Airtable table!",
      )
    }

    this.base = data.base
    this.client = data.client
    this.id = data.id
  }

  batchCreateRecords() {
    return batchCreateRecords(this, ...arguments)
  }

  batchDeleteRecords() {
    return batchDeleteRecords(this, ...arguments)
  }

  batchGetRecords() {
    return batchGetRecords(this, ...arguments)
  }

  batchUpdateRecordsDestructively() {
    return batchUpdateRecordsDestructively(this, ...arguments)
  }

  batchUpdateRecordsSafely() {
    return batchUpdateRecordsSafely(this, ...arguments)
  }

  createRecords() {
    return createRecords(this, ...arguments)
  }

  deleteRecords() {
    return deleteRecords(this, ...arguments)
  }

  getRecords() {
    return getRecords(this, ...arguments)
  }

  getSchema() {
    return getSchema(this, ...arguments)
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

export { AirtableTableRef }
