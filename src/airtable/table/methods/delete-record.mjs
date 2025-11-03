function deleteRecord(client, id) {
  return client.deleteRecords([id])
}

export { deleteRecord }
