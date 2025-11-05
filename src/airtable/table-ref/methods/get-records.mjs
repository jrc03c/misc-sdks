import { customEncodeURIComponent } from "../../utils.mjs"

function getRecords(tableRef, a, b) {
  // valid call forms:
  // - getRecords(tableRef)
  // - getRecords(tableRef, ids)
  // - getRecords(tableRef, ids, options)
  // - getRecords(tableRef, options)

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

  let ids, options

  if (arguments.length === 3) {
    if (!(a instanceof Array) || !a.every(v => typeof v === "string")) {
      throw new Error(
        "The second value passed into the `AirtableTableRef.getRecords` method must be an array of strings representing record IDs!",
      )
    }

    b = b || {}

    if (typeof b !== "object" || b instanceof Array) {
      throw new Error(
        "The third value passed into the `AirtableTableRef.getRecords` method must be null, undefined, or an object representing query options!",
      )
    }

    ids = a
    options = b
  } else if (arguments.length === 2) {
    if (a instanceof Array) {
      if (!a.every(v => typeof v === "string")) {
        throw new Error(
          "The second value passed into the `AirtableTableRef.getRecords` method must be an array of strings representing record IDs!",
        )
      }

      ids = a
    } else if (typeof a === "object") {
      options = a
    } else {
      throw new Error(
        "The second value passed into the `AirtableTableRef.getRecords` method must be either (1) an array of strings representing record IDs or (2) an object representing query options!",
      )
    }
  }

  options = options || {}

  if (ids && ids.length > 0) {
    if (typeof options.filterByFormula !== "undefined") {
      throw new Error(
        "You cannot use *both* an array of record IDs *and* a 'filterByFormula' option in the `AirtableTableRef.getRecords` method at the same time! You must use one other the other (or neither).",
      )
    }

    options.filterByFormula = `FIND(RECORD_ID(), "${ids.join(",")}")`
  }

  const queryParams = customEncodeURIComponent(options)

  const path =
    `/${tableRef.base.id}/${tableRef.id}` +
    (queryParams ? "?" + queryParams : "")

  return tableRef.client.get(path)
}

export { getRecords }
