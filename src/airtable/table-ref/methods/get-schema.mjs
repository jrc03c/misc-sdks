function getSchema(tableRef) {
  return tableRef.baseRef.getTableSchema(tableRef.id)
}

export { getSchema }
