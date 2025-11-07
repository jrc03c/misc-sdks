import { AirtableClientResponse } from "../../response.mjs"
import { PAGE_SIZE } from "../common.mjs"

async function batchGetRecordsByFormula(tableRef, formula, options, progress) {
  formula = formula || ""
  options = options || {}
  options.maxCount = options.maxCount || 100
  progress = progress || (() => {})

  if (typeof formula !== "string" || formula.length === 0) {
    throw new Error(
      "The first argument passed into the `AirtableTableRef.batchGetRecordsByFormula` method must be a non-empty string representing a formula!",
    )
  }

  if (
    typeof options.maxCount !== "number" ||
    options.maxCount < 0 ||
    options.maxCount === Infinity
  ) {
    throw new Error(
      "The options object passed as the second argument into the `AirtableTableRef.batchGetRecordsByFormula` method must have a 'maxCount' property with a finite, positive integer value representing a maximum number of records to return!",
    )
  }

  options.maxCount = Math.ceil(options.maxCount)

  const expectedResponseCount = Math.ceil(options.maxCount / PAGE_SIZE)
  const responses = []
  const records = []
  let status = 200
  let offset

  while (records.length < options.maxCount) {
    if (offset) {
      options.offset = offset
    }

    const response = await tableRef.getRecords(options)
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

    offset = response.json.offset
    progress(responses.length / expectedResponseCount)
  }

  if (responses.length < expectedResponseCount) {
    progress(1)
  }

  const data = { records, responses }

  if (offset) {
    data.offset = offset
  }

  return new AirtableClientResponse({
    ...responses[0],
    json: data,
    status,
    text: JSON.stringify(data),
  })
}

export { batchGetRecordsByFormula }
