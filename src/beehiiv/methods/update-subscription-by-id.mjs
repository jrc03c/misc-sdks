// https://developers.beehiiv.com/api-reference/subscriptions/patch

import { snakeifyKeys } from "../utils.mjs"

function updateSubscriptionById(client, pubId, subId, options) {
  // options include:
  // - custom_fields (object array; each object has):
  //   - delete (boolean)
  //   - name (string)
  //   - value (string | double | boolean | string array)
  // - stripe_customer_id (string)
  // - tier (string; one of):
  //   - free
  //   - premium
  // - unsubscribe (boolean)

  // note: this uses the `patch` (as opposed to the `put`) endpoint.

  options = snakeifyKeys(options || {})
  const path = `/publications/${pubId}/subscriptions/${subId}`

  return client.patch(path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  })
}

export { updateSubscriptionById }
