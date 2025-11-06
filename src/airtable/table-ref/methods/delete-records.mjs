import { customEncodeURIComponent } from "../../utils.mjs"
import { MAX_RECORDS_PER_REQUEST } from "../common.mjs"

function deleteRecords(tableRef, ids) {
  ids = ids || []

  if (!(ids instanceof Array) || !ids.every(v => typeof v === "string")) {
    throw new Error(
      "The value passed into the `AirtableTableRef.deleteRecords` method must be an array of strings representing record IDs!",
    )
  }

  if (ids.length > MAX_RECORDS_PER_REQUEST) {
    throw new Error(
      `The array passed into the \`AirtableTableRef.deleteRecords\` method must contain no more than ${MAX_RECORDS_PER_REQUEST} record IDs!`,
    )
  }

  const queryParams = customEncodeURIComponent({ records: ids })

  return tableRef.client.delete(
    `/${tableRef.baseRef.id}/${tableRef.id}?${queryParams}`,
  )
}

export { deleteRecords }
