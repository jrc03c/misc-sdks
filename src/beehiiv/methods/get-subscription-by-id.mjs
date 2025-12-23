// https://developers.beehiiv.com/api-reference/subscriptions/get-by-id

function getSubscriptionById(client, pubId, id, options) {
  // options include:
  // - expand (string array; any of):
  //   - custom_fields
  //   - referrals
  //   - stats
  //   - status
  //   - subscription_premium_tiers
  //   - tags

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
    `/publications/${pubId}/subscriptions/${encodeURIComponent(id)}` +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.get(path)
}

export { getSubscriptionById }
