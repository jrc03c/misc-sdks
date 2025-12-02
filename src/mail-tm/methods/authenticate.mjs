async function authenticate(client) {
  const shouldAuthenticate = false

  const response = await client.send(
    "/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: client.address,
        password: client.password,
      }),
    },
    shouldAuthenticate,
  )

  if (response.status >= 200 && response.status <= 204) {
    if (!client.id) {
      client.id = response.json.id
    }

    client.token = response.json.token
  }

  return response
}

export { authenticate }
