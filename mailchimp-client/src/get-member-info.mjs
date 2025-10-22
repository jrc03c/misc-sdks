import { parseSafe } from "./utils.mjs"

async function getMemberInfo(listId, emailAddress) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first value passed into the `getMemberInfo` method must be a string representing a list ID!",
    )
  }

  if (!emailAddress || typeof emailAddress !== "string") {
    throw new Error(
      "The second value passed into the `getMemberInfo` method must be a string representing an email address!",
    )
  }

  const response = await this.sendRequest(
    `/lists/${listId}/members/${emailAddress}`,
  )

  const raw = await response.text()
  const data = parseSafe(raw)

  if (response.status < 300) {
    return data
  } else if (response.status === 404) {
    return { email_address: emailAddress, status: "does-not-exist" }
  } else {
    throw new Error(raw)
  }
}

export { getMemberInfo }
