async function getDomains(client, page) {
  page = page ?? 1

  if (typeof page !== "number" || page < 1) {
    throw new Error(
      "The value passed into the `MailTmClient.getDomains` method, if used, must be a positive integer representing a page number!",
    )
  }

  const shouldAuthenticate = false

  return await client.send(
    `/domains?page=${Math.floor(page)}`,
    null,
    shouldAuthenticate,
  )
}

export { getDomains }
