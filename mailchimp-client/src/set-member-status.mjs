async function setMemberStatus(listId, emailAddress, status, otherData) {
  otherData = otherData || {}

  return this.setMemberInfo(listId, emailAddress, {
    status_if_new: status,
    status,
    ...otherData,
  })
}

export { setMemberStatus }
