async function deleteAccount(client) {
  if (!client.id) {
    const response = await client.authenticate()

    if (response.status >= 400) {
      return response
    }
  }

  return await client.delete(`/accounts/${client.id}`)
}

export { deleteAccount }
