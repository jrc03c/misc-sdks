import { MailTmClientResponse } from "../response.mjs"
import { safeParse } from "../../base/utils.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

async function getDomains(client, page) {
  page = page ?? 1

  if (typeof page !== "number" || page < 1) {
    throw new Error(
      "The value passed into the `MailTmClient.getDomains` method, if used, must be a positive integer representing a page number!",
    )
  }

  const url = urlPathJoin(client.baseUrl, `/domains?page=${Math.floor(page)}`)
  const response = await fetch(url)
  const raw = await response.text()
  const data = safeParse(raw)

  return new MailTmClientResponse({
    endpoint: url,
    json: data,
    method: "GET",
    status: response.status,
    text: raw,
  })
}

export { getDomains }
