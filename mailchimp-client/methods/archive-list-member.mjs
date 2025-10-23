function archiveListMember(listId, emailAddress) {
  return this.delete(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}`,
  )
}

export { archiveListMember }
