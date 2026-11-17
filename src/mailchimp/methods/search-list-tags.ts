function searchListTags(client, listId, query) {
  if (!listId || typeof listId !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.searchListTags` method must be a string representing a list (audience) ID!",
    )
  }

  if (!query || typeof query !== "string") {
    throw new Error(
      "The second argument passed into the `MailchimpClient.searchListTags` method must be a string representing a tag name for which to search!",
    )
  }

  return client.get(`/lists/${listId}/tag-search?name=${query || ""}`)
}

export { searchListTags }
