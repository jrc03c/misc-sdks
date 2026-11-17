import { standardizeEmailAddress } from "@jrc03c/js-text-tools"

async function updateSubscriptionByEmailAddress(
  client,
  pubId,
  emailAddress,
  options,
) {
  // note: at the time of this writing, there is no `patch` endpoint for
  // updating a subscription by email address. (oddly, though, there are both
  // `patch` and `put` endpoints for updating a subscription by id.) so, this
  // method performs two api calls: first, it calls the api to get the
  // subscription id that corresponds to the email address; and then second, it
  // calls the api to update the subscription via `patch` using the subscription
  // id. currently, none of the methods in this sdk utilize the `put` update
  // endpoint.

  if (client.shouldStandardizeEmailAddresses) {
    emailAddress = standardizeEmailAddress(
      emailAddress,
      client.emailStandardizationOptions,
    )
  }

  const response = await client.getSubscriptionByEmailAddress(
    pubId,
    emailAddress,
  )

  if (response.status >= 400) {
    return response
  }

  return client.updateSubscriptionById(pubId, response.json.data.id, options)
}

export { updateSubscriptionByEmailAddress }
