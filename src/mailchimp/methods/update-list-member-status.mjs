function updateListMemberStatus(client, listId, emailAddress, status, options) {
  if (!status || typeof status !== "string") {
    throw new Error(
      "The third argument passed into the `MailchimpClient.updateListMemberStatus` method must be a string representing a status!",
    )
  }

  const member = { email_address: emailAddress, status }
  return client.updateListMemberInfo(listId, member, options)
}

export { updateListMemberStatus }
