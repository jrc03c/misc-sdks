function getAccountInfo(client) {
  return client.get("/me")
}

export { getAccountInfo }
