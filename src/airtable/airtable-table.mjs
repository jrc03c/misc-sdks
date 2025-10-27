class AirtableTable {
  base = null
  id = null

  constructor(data) {
    data = data || {}

    if (!data.base) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have a 'base' property pointing to an `AirtableBase` instance!",
      )
    }

    if (!data.id) {
      throw new Error(
        "The object passed into the `AirtableTable` constructor must have an 'id' property with a string value representing the ID of an Airtable table!",
      )
    }

    this.base = data.base
    this.id = data.id
  }
}

export { AirtableTable }
