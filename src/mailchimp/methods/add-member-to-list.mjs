import { isEmailAddress } from "@jrc03c/js-text-tools"
import { standardizeEmailAddress } from "../../base/utils.mjs"

function addMemberToList(client, listId, member, options) {
  // NOTE: This method uses the PUT endpoint that upserts members (rather than
  // the POST endpoint that merely adds members).

  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)

  // if `member` is an email address string rather than a member object, then
  // convert it to a member object
  if (typeof member === "string") {
    member = { email_address: member }
  }

  if (typeof member !== "object" || !member.email_address) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.addMemberToList` method must either be (1) a string representing an email address or (2) an options object with an 'email_address' property (with a string value representing an email address)!",
    )
  }

  if (client.shouldStandardizeEmailAddresses) {
    member.email_address = standardizeEmailAddress(
      member.email_address,
      client.emailAddressStandardizationOptions,
    )
  }

  if (!isEmailAddress(member.email_address)) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.addMemberToList` method must either be (1) a string representing an email address or (2) an options object with an 'email_address' property (with a string value representing an email address)!",
    )
  }

  member.email_type = member.email_type || "html"
  member.status_if_new = client.constructor.MemberStatus.SUBSCRIBED
  options = options || {}

  const path =
    `/lists/${listId}/members/${encodeURIComponent(member.email_address)}` +
    (options.shouldSkipMergeValidation ? "?skip_merge_validation=true" : "")

  return client.put(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
}

export { addMemberToList }
