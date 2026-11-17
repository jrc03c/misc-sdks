function removeTagsFromListMember(client, listId, emailAddress, tags, options) {
  // if the tags array contains tag strings instead of tag objects, then convert
  // the tag strings to tag objects
  tags = (() => {
    const temp = []

    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i]

      if (typeof tag === "string") {
        tag = {
          name: tag,
        }
      }

      tag.status = client.constructor.TagStatus.INACTIVE
      temp.push(tag)
    }

    return temp
  })()

  return client.updateListMemberTags(listId, emailAddress, tags, options)
}

export { removeTagsFromListMember }
