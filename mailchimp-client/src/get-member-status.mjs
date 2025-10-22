async function getMemberStatus(listId, emailAddress) {
  return (await this.getMemberInfo(listId, emailAddress)).status
}

export { getMemberStatus }
