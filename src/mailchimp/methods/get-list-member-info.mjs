function getListMemberInfo(client, listId, emailAddress, options) {
  // options include:
  // - fieldsToInclude (array of strings)
  // - fieldsToExclude (array of strings)

  options = options || {}
  const queryParams = []

  if (options.fieldsToInclude) {
    queryParams.push(`fields=${options.fieldsToInclude.join(",")}`)
  }

  if (options.fieldsToExclude) {
    queryParams.push(`fields=${options.fieldsToExclude.join(",")}`)
  }

  const path =
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.get(path)
}

export { getListMemberInfo }
