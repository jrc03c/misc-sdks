import { AirtableClientResponse } from "../../response.mjs"

async function createRecord(client, record, options) {
  const response = await client.createRecords([record], options)

  if (response.status > 204) {
    return response
  }

  return new AirtableClientResponse({
    ...response,
    json: response.json.records[0],
    text: JSON.stringify(response.json.records[0]),
  })
}

export { createRecord }
