import { convertQueryParamsObjectToString } from "../../base/utils.mjs"

function getRecord(id, options) {
  // https://airtable.com/developers/web/api/get-record#query
  // options include:
  // - cellFormat
  // - returnFieldsByFieldId

  options = options || {}
  const queryParams = convertQueryParamsObjectToString(options)

  const path =
    `/${this.base.id}/${this.id}/${id}` + (queryParams ? "?" + queryParams : "")

  return this.client.get(path)
}

export { getRecord }
