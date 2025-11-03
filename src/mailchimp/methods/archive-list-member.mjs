function archiveListMember(client, listId, emailAddress) {
  return client.delete(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}`,
  )
}

export { archiveListMember }
