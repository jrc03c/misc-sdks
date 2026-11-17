function getMessage(client, id) {
  if (typeof id !== "string") {
    throw new Error(
      "The value passed into the `MailTmClient.getMessage` method must be a string representing a message ID!",
    )
  }

  return client.get(`/messages/${id}`)
}

export { getMessage }
