function getSchema(client) {
  return client.base.getTableSchema(client.id)
}

export { getSchema }
