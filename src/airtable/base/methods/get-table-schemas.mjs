function getTableSchemas() {
  return this.client.get(`/meta/bases/${this.id}/tables`)
}

export { getTableSchemas }
