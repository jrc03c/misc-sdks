function searchListTags(listId, query) {
  return this.get(`/lists/${listId}/tag-search?name=${query || ""}`)
}

export { searchListTags }
