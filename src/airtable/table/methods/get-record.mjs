import { superEncodeURIComponent } from "../../utils.mjs"

function getRecord(client, id, options) {
  // https://airtable.com/developers/web/api/get-record#query
  // options include:
  // - cellFormat
  // - returnFieldsByFieldId

  options = options || {}
  const queryParams = superEncodeURIComponent(options)

  const path =
    `/${client.base.id}/${client.id}/${id}` +
    (queryParams ? "?" + queryParams : "")

  return client.client.get(path)
}

export { getRecord }
