import { superEncodeURIComponent } from "../../utils.mjs"

function getRecords(client, ids, options) {
  // note: be aware that this function will return a 200 response even when that
  // response contains 0 records!
  // -----
  // https://airtable.com/developers/web/api/list-records#query
  // options include:
  // - cellFormat
  // - direction
  // - field
  // - fields
  // - filterByFormula
  // - maxRecords
  // - offset
  // - pageSize
  // - recordMetadata
  // - returnFieldsByFieldId
  // - sort
  // - timeZone
  // - userLocale
  // - view

  ids = ids || []
  options = options || {}

  if (ids.length > 0 && !options.filterByFormula) {
    options.filterByFormula = `FIND(RECORD_ID(), "${ids.join(", ")}") > 0`
  }

  const queryParams = superEncodeURIComponent(options)

  const path =
    `/${client.base.id}/${client.id}` + (queryParams ? "?" + queryParams : "")

  return client.client.get(path)
}

export { getRecords }
