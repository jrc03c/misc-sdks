function getListInfo(client, listId) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The value passed into the `MailchimpClient.getListInfo` method must be a string representing a list (audience) ID!",
    )
  }

  return client.get(`/lists/${listId}`)
}

export { getListInfo }
