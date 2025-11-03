function getTableSchemas(baseRef) {
  return baseRef.client.get(`/meta/bases/${baseRef.id}/tables`)
}

export { getTableSchemas }
