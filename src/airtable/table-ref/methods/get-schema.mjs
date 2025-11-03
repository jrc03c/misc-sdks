function getSchema(tableRef) {
  return tableRef.base.getTableSchema(tableRef.id)
}

export { getSchema }
