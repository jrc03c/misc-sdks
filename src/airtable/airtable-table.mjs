class AirtableTable {
  base = null
  client = null
  id = null

  constructor(data) {
    data = data || {}

    if (!data.base) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have a 'base' property pointing to an `AirtableBase` instance!",
      )
    }

    if (!data.client) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have a 'client' property pointing to an `AirtableClient` instance!",
      )
    }

    if (!data.id) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have an 'id' property with a string value representing the ID of an Airtable table!",
      )
    }

    this.base = data.base
    this.client = data.client
    this.id = data.id
  }

  listRecords(options) {
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
}

export { AirtableTable }
