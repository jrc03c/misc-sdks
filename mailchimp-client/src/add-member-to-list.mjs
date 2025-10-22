async function addMemberToList(listId, emailAddress, otherData) {
  return this.setMemberStatus(
    listId,
    emailAddress,
    "subscribed",
    otherData || {},
  )
}

export { addMemberToList }
