function updateListMemberInfo(listId, member, options) {
  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)

  options = options || {}
  const queryParams = []

  if (options.shouldSkipMergeValidation) {
    queryParams.push(`skip_merge_validation=true`)
  }

  const path =
    `/lists/${listId}/members/${encodeURIComponent(member.email_address)}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return this.patch(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
}

export { updateListMemberInfo }
