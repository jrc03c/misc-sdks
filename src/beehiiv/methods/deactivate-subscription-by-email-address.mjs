import { standardizeEmailAddress } from "@jrc03c/js-text-tools"

async function deactivateSubscriptionByEmailAddress(
  client,
  pubId,
  emailAddress,
) {
  // note: this is a helper method that doesn't actually correspond directly to
  // specific api endpoint. the deactivation endpoint that exists requires a
  // subscription id; so this method first makes a call to get the subscription
  // id that corresponds to the email address, and then calls the deactivation
  // endpoint using the subscription id.

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

  return client.deactivateSubscriptionById(pubId, response.json.data.id)
}

export { deactivateSubscriptionByEmailAddress }
