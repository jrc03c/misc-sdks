import { customEncodeURIComponent } from "../../utils.mjs"

function getRecord(tableRef, id, options) {
  // https://airtable.com/developers/web/api/get-record#query
  // options include:
  // - cellFormat
  // - returnFieldsByFieldId

  options = options || {}
  const queryParams = customEncodeURIComponent(options)

  const path =
    `/${tableRef.base.id}/${tableRef.id}/${id}` +
    (queryParams ? "?" + queryParams : "")

  return tableRef.client.get(path)
}

export { getRecord }
