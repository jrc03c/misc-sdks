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
    return new AirtableClientResponse({
      ...response,
      json: { error: "NOT_FOUND" },
      status: 404,
      text: '{"error":"NOT_FOUND"}',
    })
  }

  return new AirtableClientResponse({
    ...response,
    json: schema,
    text: JSON.stringify(schema),
  })
}

export { getTableSchema }
