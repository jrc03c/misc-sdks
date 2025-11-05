import { isEmailAddress } from "@jrc03c/js-text-tools"

function getListMemberInfo(client, listId, emailAddress, options) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.getListMemberInfo` method must be a string representing a list (audience) ID!",
    )
  }

  if (!isEmailAddress(emailAddress)) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.getListMemberInfo` method must be a string representing an email address!",
    )
  }

  // options include:
  // - fieldsToInclude (array of strings)
  // - fieldsToExclude (array of strings)

  options = options || {}
  const queryParams = []

  if (options.fieldsToInclude) {
    queryParams.push(`fields=${options.fieldsToInclude.join(",")}`)
  }

  if (options.fieldsToExclude) {
    queryParams.push(`fields=${options.fieldsToExclude.join(",")}`)
  }

  const path =
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.get(path)
}

export { getListMemberInfo }
