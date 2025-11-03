function getListMemberTags(client, listId, emailAddress) {
  return client.get(
    `/lists/${listId}/members/${encodeURIComponent(emailAddress)}/tags`,
  )
}

export { getListMemberTags }
