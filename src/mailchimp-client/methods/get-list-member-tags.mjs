function getListMemberTags(listId, emailAddress) {
  return this.get(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}/tags`,
  )
}

export { getListMemberTags }
