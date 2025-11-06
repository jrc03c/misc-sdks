import { AirtableClientResponse } from "../../response.mjs"

async function batchGetRecords(tableRef, ids, options, progress) {
  // note: this method automatically sets a `maxRecords` count if the `options`
  // object does not include one!

  ids = ids || []
  options = options || {}
  options.maxRecords = options.maxRecords || 100
  progress = progress || (() => {})

  if (
    typeof options.maxRecords !== "number" ||
    options.maxRecords < 0 ||
    options.maxRecords === Infinity
  ) {
    throw new Error(
      "The options object passed as the second argument into the `AirtableTableRef.batchGetRecords` method must have 'maxRecords' property with a finite, positive integer value representing a maximum number of records to return!",
    )
  }

  options.maxRecords = Math.ceil(options.maxRecords)

  const responses = []
  const records = []
  let status = 200
  let offset

  while (records.length < options.maxRecords) {
    if (offset) {
      options.offset = offset
    }

    const response = await tableRef.getRecords(ids, options)
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
    progress(records.length / options.maxRecords)

    if (!offset) {
      break
    }
  }

  if (records.length < options.maxRecords) {
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

export { batchGetRecords }
