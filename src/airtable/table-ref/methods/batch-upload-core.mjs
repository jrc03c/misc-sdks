import { AirtableClientResponse } from "../../response.mjs"
import { MAX_RECORDS_PER_REQUEST } from "../common.mjs"

async function batchUploadCore(tableRefMethod, records, options, progress) {
  records = records || []
  options = options || {}
  progress = progress || (() => {})

  const responses = []
  const newRecords = []
  let status = 200

  for (let i = 0; i < records.length; i += MAX_RECORDS_PER_REQUEST) {
    const chunk = records.slice(i, i + MAX_RECORDS_PER_REQUEST)
    const response = await tableRefMethod(chunk, options)
    responses.push(response)

    if (response.status > status) {
      status = response.status
    }

    if (
      response.status >= 200 &&
      response.status <= 204 &&
      response.json.records &&
      response.json.records instanceof Array
    ) {
      newRecords.push(...response.json.records)
    }

    progress(i / records.length)
  }

  progress(1)

  const data = { responses }

  if (newRecords.length > 0) {
    data.records = newRecords
  }

  return new AirtableClientResponse({
    ...responses[0],
    json: data,
    status,
    text: JSON.stringify(data),
  })
}

export { batchUploadCore }
