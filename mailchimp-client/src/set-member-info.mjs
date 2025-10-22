import { parseSafe } from "./utils.mjs"

async function setMemberInfo(listId, emailAddress, info) {
  info = info || {}

  const response = await this.sendRequest(
    `/lists/${listId}/members/${emailAddress}`,
    {
      method: "PUT",
      body: JSON.stringify({
        email_address: emailAddress,
        ...info,
      }),
    },
  )

  const raw = await response.text()
  const data = parseSafe(raw)

  if (response.status < 300) {
    return data
  } else {
    throw new Error(raw)
  }
}

export { setMemberInfo }
