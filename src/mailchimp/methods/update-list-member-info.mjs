import { isEmailAddress } from "@jrc03c/js-text-tools"
import { standardizeEmailAddress } from "../../base/utils.mjs"

function updateListMemberInfo(client, listId, member, options) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.updateListMemberInfo` method must be a string representing a list (audience) ID!",
    )
  }

  if (
    typeof member !== "object" ||
    member === null ||
    !isEmailAddress(member.email_address)
  ) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.updateListMemberInfo` method must be an object representing member data (e.g., including an 'email_address' property)!",
    )
  }

  if (client.shouldStandardizeEmailAddresses) {
    member.email_address = standardizeEmailAddress(
      member.email_address,
      client.emailStandardizationOptions,
    )
  }

  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)

  options = options || {}
  const queryParams = []

  if (options.shouldSkipMergeValidation) {
    queryParams.push(`skip_merge_validation=true`)
  }

  const path =
    `/lists/${listId}/members/${encodeURIComponent(member.email_address)}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.patch(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
}

export { updateListMemberInfo }
