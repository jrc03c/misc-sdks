import { AirtableClientResponse } from "../../response.mjs"

async function getTableSchema(id) {
  const response = await this.getTableSchemas()

  if (response.status > 204) {
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
