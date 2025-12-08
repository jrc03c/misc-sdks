function getRecords(tableRef, a, b) {
  // valid call forms:
  // - getRecords(tableRef)
  // - getRecords(tableRef, ids)
  // - getRecords(tableRef, ids, options)
  // - getRecords(tableRef, options)

  // note: be aware that this function will return a 200 response even when that
  // response contains 0 records!
  // -----
  // note: be aware that this function uses the POST version of the request
  // instead of the GET version. you can see airtable's api documentation for
  // this endpoint for more info, though in practice this shouldn't make any
  // difference to users of this library (as far as i can tell).
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

  return tableRef.client.post(
    `/${tableRef.baseRef.id}/${tableRef.id}/listRecords`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    },
  )
}

export { getRecords }
