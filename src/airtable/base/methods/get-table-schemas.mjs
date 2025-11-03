function getTableSchemas(client) {
  return client.client.get(`/meta/bases/${client.id}/tables`)
}

export { getTableSchemas }
