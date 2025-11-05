function getMessages(client, page) {
  page = page ?? 1

  if (typeof page !== "number" || page < 1) {
    throw new Error(
      "The value passed into the `MailTmClient.getMessages` method, if used, must be a positive integer representing a page number!",
    )
  }

  return client.get(`/messages?page=${Math.floor(page)}`)
}

export { getMessages }
