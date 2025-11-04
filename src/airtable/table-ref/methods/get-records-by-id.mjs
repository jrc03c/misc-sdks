function getRecordsById(tableRef, ids, options) {
  ids = ids || []
  options = options || {}

  if (
    !(ids instanceof Array) ||
    ids.length === 0 ||
    !ids.every(v => typeof v === "string")
  ) {
    throw new Error(
      "The first value passed into the `AirtableTableRef.getRecordsById` method must be a non-empty array of strings representing record IDs!",
    )
  }

  options.filterByFormula = `FIND(RECORD_ID(), "${ids.join(",")}")`
  return tableRef.getRecords(options)
}

export { getRecordsById }
