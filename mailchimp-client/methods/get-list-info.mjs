function getListInfo(listId) {
  return this.get(`/lists/${listId}`)
}

export { getListInfo }
