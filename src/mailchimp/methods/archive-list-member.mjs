import { isEmailAddress } from "@jrc03c/js-text-tools"

function archiveListMember(client, listId, emailAddress) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.archiveListMember` method must be a string representing a list (audience) ID!",
    )
  }

  if (!isEmailAddress(emailAddress)) {
    throw new Error(
      "The second argument passed into the `MailchimpClient.archiveListMember` method must be a string representing an email address!",
    )
  }

  return client.delete(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}`,
  )
}

export { archiveListMember }
