import { superEncodeURIComponent } from "../utils.mjs"

function getRecords(options) {
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

  options = options || {}
  const queryParams = superEncodeURIComponent(options)

  const path =
    `/${this.base.id}/${this.id}` + (queryParams ? "?" + queryParams : "")

  return this.client.get(path)
}

export { getRecords }
