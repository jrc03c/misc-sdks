// https://developers.beehiiv.com/api-reference/subscriptions/get-by-email

import { standardizeEmailAddress } from "@jrc03c/js-text-tools"

function getSubscriptionByEmailAddress(client, pubId, emailAddress, options) {
  // options include:
  // - expand (string array; any of):
  //   - custom_fields
  //   - referrals
  //   - stats
  //   - status
  //   - subscription_premium_tiers
  //   - tags

  if (client.shouldStandardizeEmailAddress) {
    emailAddress = standardizeEmailAddress(
      emailAddress,
      client.emailStandardizationOptions,
    )
  }

  options = options || {}
  const queryParams = []

  if (options.expand) {
    let { expand } = options

    if (typeof expand === "string") {
      expand = [expand]
    }

    for (let i = 0; i < expand.length; i++) {
      queryParams.push(`expand[]=${encodeURIComponent(expand[i])}`)
    }
  }

  const path =
    `/publications/${pubId}/subscriptions/by_email/${encodeURIComponent(emailAddress)}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.get(path)
}

export { getSubscriptionByEmailAddress }
