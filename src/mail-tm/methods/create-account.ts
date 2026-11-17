async function createAccount(client, address, password) {
  const shouldAuthenticate = false

  return await client.send(
    "/accounts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    },
    shouldAuthenticate,
  )
}

export { createAccount }
