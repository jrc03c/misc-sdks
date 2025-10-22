async function getAllMembersInSegment(listId, segmentId) {
  const out = []
  let isStillFetching = true
  let offset = 0
  let count = 1000

  while (isStillFetching) {
    const response = await this.sendRequest(
      `/lists/${listId}/segments/${segmentId}/members?count=${count}&offset=${offset}`,
    )

    const data = await response.json()
    const members = data.members || []
    out.push(...members)
    offset += members.length

    if (members.length === 0) {
      isStillFetching = false
    }
  }

  return out
}

export { getAllMembersInSegment }
