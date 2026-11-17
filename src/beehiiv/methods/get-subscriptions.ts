// https://developers.beehiiv.com/api-reference/subscriptions/index

import { standardizeEmailAddress } from "@jrc03c/js-text-tools"

function getSubscriptions(client, pubId, options) {
  // options include:
  // - creation_date (string; format = yyyy/mm/dd)
  // - cursor (string)
  // - direction (string; one of):
  //   - asc
  //   - desc
  // - email (string)
  // - expand (string array; any of):
  //   - custom_fields
  //   - referrals
  //   - stats
  //   - subscription_premium_tiers
  // - limit (integer; default = 10)
  // - order_by (string; one of):
  //   - created
  // - premium_tier_ids (string array)
  // - premium_tiers (string array)
  // - status (string; one of):
  //   - active
  //   - all
  //   - inactive
  //   - invalid
  //   - pending
  //   - validating
  // - tier (string; one of):
  //   - all
  //   - free
  //   - premium

  options = options || {}
  const queryParams = []

  if (options.creationDate) {
    queryParams.push(
      `creation_date=${encodeURIComponent(options.creationDate)}`,
    )
  }

  if (options.cursor) {
    queryParams.push(`cursor=${encodeURIComponent(options.cursor)}`)
  }

  if (options.direction) {
    queryParams.push(`direction=${encodeURIComponent(options.direction)}`)
  }

  if (options.email) {
    const email = client.shouldStandardizeEmailAddresses
      ? standardizeEmailAddress(
          options.email,
          client.emailStandardizationOptions,
        )
      : options.email

    queryParams.push(`email=${encodeURIComponent(email)}`)
  }

  if (options.expand) {
    let { expand } = options

    if (typeof expand === "string") {
      expand = [expand]
    }

    for (let i = 0; i < expand.length; i++) {
      queryParams.push(`expand[]=${encodeURIComponent(expand[i])}`)
    }
  }

  if (options.limit) {
    queryParams.push(`limit=${encodeURIComponent(options.limit)}`)
  }

  if (options.orderBy) {
    queryParams.push(`order_by=created`)
  }

  if (options.premiumTierIds) {
    for (let i = 0; i < options.premiumTierIds.length; i++) {
      queryParams.push(
        `premium_tier_ids[]=${encodeURIComponent(options.premiumTierIds[i])}`,
      )
    }
  }

  if (options.premiumTiers) {
    for (let i = 0; i < options.premiumTiers.length; i++) {
      queryParams.push(
        `premium_tiers[]=${encodeURIComponent(options.premiumTiers[i])}`,
      )
    }
  }

  if (options.status) {
    queryParams.push(`status=${encodeURIComponent(options.status)}`)
  }

  if (options.tier) {
    queryParams.push(`tier=${encodeURIComponent(options.tier)}`)
  }

  const path =
    `/publications/${pubId}/subscriptions` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.get(path)
}

export { getSubscriptions }
