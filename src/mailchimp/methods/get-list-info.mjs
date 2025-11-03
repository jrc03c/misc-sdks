function getListInfo(client, listId) {
  return client.get(`/lists/${listId}`)
}

export { getListInfo }
