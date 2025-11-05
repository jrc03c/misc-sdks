import { MailTmClientResponse } from "../response.mjs"
import { safeParse } from "../../base/utils.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

async function authenticate(client) {
  const url = urlPathJoin(client.baseUrl, "/token")

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      address: client.address,
      password: client.password,
    }),
  })

  const raw = await response.text()
  const data = safeParse(raw)

  const out = new MailTmClientResponse({
    endpoint: url,
    json: data,
    method: "POST",
    status: response.status,
    text: raw,
  })

  if (out.status >= 200 && out.status <= 204) {
    client.token = data.token
  }

  return out
}

export { authenticate }
