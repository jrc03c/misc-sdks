function updateListMemberStatus(listId, emailAddress, status, options) {
  const member = { email_address: emailAddress, status }
  return this.updateListMemberInfo(listId, member, options)
}

export { updateListMemberStatus }
