function updateListMemberStatus(client, listId, emailAddress, status, options) {
  const member = { email_address: emailAddress, status }
  return client.updateListMemberInfo(listId, member, options)
}

export { updateListMemberStatus }
