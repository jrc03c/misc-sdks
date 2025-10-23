function batchAddMembersToList(listId, members, options) {
  // note: can send no more than 500 members per request

  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)
  // - shouldSkipDuplicateCheck (boolean; default = false)
  // - shouldSyncTags (boolean; default = false)
  // - shouldUpdateExisting (boolean; default = true)

  if (members.length > 500) {
    throw new Error(
      "The members array passed into the `MailchimpClient.batchAddMembersToList` method must contain no more than 500 member objects!",
    )
  }

  options = options || {}
  const queryParams = []

  if (options.shouldSkipMergeValidation) {
    queryParams.push(`skip_merge_validation=true`)
  }

  if (options.shouldSkipDuplicateCheck) {
    queryParams.push(`skip_duplicate_check=true`)
  }

  const path =
    `/lists/${listId}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return this.post(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      members,
      sync_tags: !!options.shouldSyncTags,
      update_existing:
        typeof options.shouldUpdateExisting === "undefined" ||
        !!options.shouldUpdateExisting,
    }),
  })
}

export { batchAddMembersToList }
