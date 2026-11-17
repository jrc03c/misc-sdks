import { AirtableClientResponse } from "../../response.mjs"
import { PAGE_SIZE } from "../common.mjs"

async function batchGetRecordsById(tableRef, ids, options, progress) {
  ids = ids || []
  options = options || {}
  progress = progress || (() => {})

  if (
    !(ids instanceof Array) ||
    ids.length === 0 ||
    !ids.every(v => typeof v === "string")
  ) {
    throw new Error(
      "The first argument passed into the `AirtableTableRef.batchGetRecordsById` method must be a non-empty array of strings representing record IDs!",
    )
  }

  const expectedResponseCount = Math.ceil(ids.length / PAGE_SIZE)
  const responses = []
  const records = []
  let status = 200

  for (let i = 0; i < ids.length; i += PAGE_SIZE) {
    delete options.maxCount
    delete options.filterByFormula

    const chunk = ids.slice(i, i + PAGE_SIZE)
    const response = await tableRef.getRecords(chunk, options)
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
      records.push(...response.json.records)
    }

    progress(responses.length / expectedResponseCount)
  }

  if (responses.length < expectedResponseCount) {
    progress(1)
  }

  const data = { records, responses }

  return new AirtableClientResponse({
    ...responses[0],
    json: data,
    status,
    text: JSON.stringify(data),
  })
}

export { batchGetRecordsById }
