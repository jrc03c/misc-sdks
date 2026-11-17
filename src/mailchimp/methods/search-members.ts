function searchMembers(client, query, options) {
  if (!query || typeof query !== "string") {
    throw new Error(
      "The first argument passed into the `MailchimpClient.searchMembers` method must be a string representing a query!",
    )
  }

  // options include:
  // - fieldsToInclude (array of strings)
  // - fieldsToExclude (array of strings)
  // - listId (string)

  options = options || {}
  const queryParams = []

  if (options.fieldsToInclude) {
    queryParams.push(`fields=${options.fieldsToInclude.join(",")}`)
  }

  if (options.fieldsToExclude) {
    queryParams.push(`exclude_fields=${options.fieldsToExclude.join(",")}`)
  }

  if (options.listId) {
    queryParams.push(`list_id=${options.listId}`)
  }

  queryParams.push(`query=${encodeURIComponent(query)}`)
  const path = `/search-members?` + queryParams.join("&")
  return client.get(path)
}

export { searchMembers }
