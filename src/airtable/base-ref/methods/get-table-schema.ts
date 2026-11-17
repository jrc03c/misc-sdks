import { AirtableClientResponse } from "../../response.mjs"

async function getTableSchema(baseRef, id) {
  if (typeof id !== "string") {
    throw new Error(
      "The value passed into the `AirtableBaseRef.getTableSchema` method must be a string representing a table ID!",
    )
  }

  const response = await baseRef.getTableSchemas()

  if (response.status >= 400) {
    return response
  }

  const schema = response.json.tables.find(t => t.id === id)

  if (!schema) {
    const data = {
      error:
        "The specified table was not found, or you do not have permission to access it.",
    }

    return new AirtableClientResponse({
      ...response,
      json: data,
      status: 404,
      text: JSON.stringify(data),
    })
  }

  return new AirtableClientResponse({
    ...response,
    json: schema,
    text: JSON.stringify(schema),
  })
}

export { getTableSchema }
