function updateListMemberTags(listId, emailAddress, tags, options) {
  // options include:
  // - isSyncing (boolean; default = false)

  options = options || {}

  // if the tags array contains tag strings instead of tag objects, then convert
  // the tag strings to tag objects. note: this assumes that the intended update
  // should *add* tags rather than *remove* them!
  tags = (() => {
    const temp = []

    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i]

      if (typeof tag === "string") {
        tag = {
          name: tag,
          status: this.constructor.TagStatus.ACTIVE,
        }
      }

      temp.push(tag)
    }

    return temp
  })()

  return this.post(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}/tags`,
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags,
        is_syncing: !!options.isSyncing,
      }),
    },
  )
}

export { updateListMemberTags }
