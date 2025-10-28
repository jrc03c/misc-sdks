import { superEncodeURIComponent } from "../../utils.mjs"

function getRecords(ids, options) {
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
    `/${this.base.id}/${this.id}` + (queryParams ? "?" + queryParams : "")

  return this.client.get(path)
}

export { getRecords }
