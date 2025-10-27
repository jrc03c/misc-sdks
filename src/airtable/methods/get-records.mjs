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

  let queryParams = []
  const keys = Object.keys(options)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    let value = options[key]

    if (typeof value === "string") {
      value = encodeURIComponent(value)
    }

    queryParams.push(`${key}=${value}`)
  }

  const path =
    `/${this.base.id}/${this.id}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return this.client.get(path)
}

export { getRecords }
