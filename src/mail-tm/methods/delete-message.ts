function deleteMessage(client, id) {
  if (typeof id !== "string") {
    throw new Error(
      "The value passed into the `MailTmClient.deleteMessage` method must be a string representing a message ID!",
    )
  }

  return client.delete(`/messages/${id}`)
}

export { deleteMessage }
