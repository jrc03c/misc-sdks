function addMemberToList(listId, member, options) {
  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)

  options = options || {}

  const path =
    `/lists/${listId}/members` +
    (options.shouldSkipMergeValidation ? "?skip_merge_validation=true" : "")

  return this.post(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
}

export { addMemberToList }
