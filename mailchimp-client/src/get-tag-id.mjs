async function getTagId(listId, tagName) {
  const response = await this.sendRequest(
    "/lists/" + listId + "/tag-search?name=" + tagName,
  )

  const data = await response.json()
  const match = data.tags.find(t => t.name === tagName)
  return match ? match.id : null
}

export { getTagId }
