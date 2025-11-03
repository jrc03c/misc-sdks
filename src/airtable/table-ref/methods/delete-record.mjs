function deleteRecord(tableRef, id) {
  return tableRef.deleteRecords([id])
}

export { deleteRecord }
