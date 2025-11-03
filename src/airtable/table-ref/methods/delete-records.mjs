import { customEncodeURIComponent } from "../../utils.mjs"

function deleteRecords(tableRef, ids) {
  if (!(ids instanceof Array) || !ids.every(v => typeof v === "string")) {
    throw new Error(
      "The value passed into the `AirtableTable.deleteRecords` method must be an array of strings representing record IDs!",
    )
  }

  const queryParams = customEncodeURIComponent({ records: ids })

  return tableRef.client.delete(
    `/${tableRef.base.id}/${tableRef.id}?${queryParams}`,
  )
}

export { deleteRecords }
