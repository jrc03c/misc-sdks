function searchListTags(client, listId, query) {
  return client.get(`/lists/${listId}/tag-search?name=${query || ""}`)
}

export { searchListTags }
