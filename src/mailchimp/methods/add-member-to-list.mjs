import { isEmailAddress } from "@jrc03c/js-text-tools"

function addMemberToList(client, listId, member, options) {
  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)

  // if `member` is an email address string rather than a member object, then
  // convert it to a member object
  if (typeof member === "string") {
    member = {
      email_address: member,
      email_type: "html",
      status: client.constructor.MemberStatus.SUBSCRIBED,
    }
  }

  if (typeof member !== "object" || !isEmailAddress(member.email_address)) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.addMemberToList` method must either be (1) a string representing an email address or (2) an options object with an 'email_address' property (with a string value representing an email address)!",
    )
  }

  member.status = client.constructor.MemberStatus.SUBSCRIBED
  options = options || {}

  const path =
    `/lists/${listId}/members` +
    (options.shouldSkipMergeValidation ? "?skip_merge_validation=true" : "")

  return client.post(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
}

export { addMemberToList }
