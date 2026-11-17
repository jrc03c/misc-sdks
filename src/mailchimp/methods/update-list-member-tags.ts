import { isEmailAddress, standardizeEmailAddress } from "@jrc03c/js-text-tools"

function updateListMemberTags(client, listId, emailAddress, tags, options) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.updateListMemberTags` method must be a string representing a list (audience) ID!",
    )
  }

  if (!isEmailAddress(emailAddress)) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.updateListMemberTags` method must be a string representing an email address!",
    )
  }

  if (client.shouldStandardizeEmailAddresses) {
    emailAddress = standardizeEmailAddress(
      emailAddress,
      client.emailAddressStandardizationOptions,
    )
  }

  // if the tags array contains tag strings instead of tag objects, then convert
  // the tag strings to tag objects. note: this assumes that the intended update
  // should *add* tags rather than *remove* them!
  tags = (() => {
    const temp = []

    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i]

      if (typeof tag === "string") {
        tag = {
          name: tag,
          status: client.constructor.TagStatus.ACTIVE,
        }
      }

      if (typeof tag !== "object" || typeof tag.name !== "string") {
        throw new Error(
          "The third argument passed into the `MailchimpClient.updateListMemberTags` method must be an array containing either (1) strings representing tag names or (2) objects with 'name' properties representing tag names!",
        )
      }

      temp.push(tag)
    }

    return temp
  })()

  // options include:
  // - isSyncing (boolean; default = false)
  options = options || {}

  return client.post(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}/tags`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags,
        is_syncing: !!options.isSyncing,
      }),
    },
  )
}

export { updateListMemberTags }
