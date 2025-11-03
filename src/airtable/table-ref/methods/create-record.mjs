import { AirtableClientResponse } from "../../response.mjs"

async function createRecord(tableRef, record, options) {
  const response = await tableRef.createRecords([record], options)

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
