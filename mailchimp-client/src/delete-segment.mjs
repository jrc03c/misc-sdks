async function deleteSegment(listId, segmentId) {
  await this.sendRequest("/lists/" + listId + "/segments/" + segmentId, {
    method: "DELETE",
  })

  return true
}

export { deleteSegment }
