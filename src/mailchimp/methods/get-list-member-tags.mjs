import { isEmailAddress } from "@jrc03c/js-text-tools"
import { standardizeEmailAddress } from "../../base/utils.mjs"

function getListMemberTags(client, listId, emailAddress) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.getListMemberTags` method must be a string representing a list (audience) ID!",
    )
  }

  if (!isEmailAddress(emailAddress)) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.getListMemberTags` method must be a string representing an email address!",
    )
  }

  if (client.shouldStandardizeEmailAddresses) {
    emailAddress = standardizeEmailAddress(
      emailAddress,
      client.emailStandardizationOptions,
    )
  }

  return client.get(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}/tags`,
  )
}

export { getListMemberTags }
