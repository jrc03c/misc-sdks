import { superEncodeURIComponent } from "../../utils.mjs"

function deleteRecords(client, ids) {
  if (!(ids instanceof Array) || !ids.every(v => typeof v === "string")) {
    throw new Error(
      "The value passed into the `AirtableTable.deleteRecords` method must be an array of strings representing record IDs!",
    )
  }

  return client.client.delete(
    `/${client.base.id}/${client.id}?${superEncodeURIComponent({ records: ids })}`,
  )
}

export { deleteRecords }
