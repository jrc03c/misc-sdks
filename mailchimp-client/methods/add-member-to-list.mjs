function addMemberToList(listId, member, options) {
  // options include:
  // - shouldSkipMergeValidation (boolean; default = false)

  // if `member` is an email address string rather than a member object, then
  // convert it to a member object
  if (typeof member === "string") {
    member = {
      email_address: member,
      email_type: "html",
      status: this.constructor.Status.SUBSCRIBED,
    }
  }

  options = options || {}

  const path =
    `/lists/${listId}/members` +
    (options.shouldSkipMergeValidation ? "?skip_merge_validation=true" : "")

  if (!member.status) {
    member.status = this.constructor.Status.SUBSCRIBED
  }

  return this.post(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  })
}

export { addMemberToList }
