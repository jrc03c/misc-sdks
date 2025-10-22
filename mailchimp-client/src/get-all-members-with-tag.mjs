async function getAllMembersWithTag(listId, tagId) {
  const segment = await this.createSegmentForTag(listId, tagId)
  const members = await this.getAllMembersInSegment(listId, segment.id)
  await this.deleteSegment(listId, segment.id)
  return members
}

export { getAllMembersWithTag }
