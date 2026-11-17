// https://developers.beehiiv.com/api-reference/subscriptions/create

import { snakeifyKeys } from "../utils.mjs"
import { standardizeEmailAddress } from "@jrc03c/js-text-tools"

function createSubscription(client, pubId) {
  // valid call formats:
  // - createSubscription(client, pubId, emailAddress)
  // - createSubscription(client, pubId, emailAddress, options)
  // - createSubscription(client, pubId, options)

  // note: be aware that beehiiv does not automatically accept subscribers!
  // instead, beehiiv always gives each new subscriber a "validating" status
  // until they decide (using criteria that we can neither inspect nor control)
  // whether or not the new subscriber is worthy. so, assuming this request is
  // structured correctly, the response should always have a 200-ish status
  // regardless of whether or not the address is valid according to beehiiv's
  // criteria.

  // options include:
  // - automation_ids (string array)
  // - custom_fields (object array; each object has):
  //   - name (string)
  //   - value (string | double | boolean | string array)
  // - double_opt_override (string; one of):
  //   - not_set
  //   - off
  //   - on
  // - email (string, required)
  // - premium_tiers (string array)
  // - premium_tier_ids (string array)
  // - reactivate_existing (boolean; default = false*)
  // - referall_code (string)
  // - referring_site (string)
  // - send_welcome_email (boolean; default = false)
  // - stripe_customer_id (string)
  // - tier (string; one of):
  //   - free
  //   - premium
  // - utm_campaign (string)
  // - utm_medium (string)
  // - utm_source (string)

  // *note: beehiiv's default value for `reactivate_existing` is `false`, but
  // i'm going to set the default to `true` for this sdk.

  let emailAddress, options

  if (arguments.length === 4) {
    emailAddress = arguments[2]
    options = arguments[3]
  } else if (arguments.length === 3) {
    if (typeof arguments[2] === "string") {
      emailAddress = arguments[2]
    } else {
      options = arguments[2]
    }
  }

  options = snakeifyKeys(options || {})

  if (emailAddress) {
    options.email = emailAddress
  }

  if (client.shouldStandardizeEmailAddresses) {
    options.email = standardizeEmailAddress(
      options.email,
      client.emailStandardizationOptions,
    )
  }

  options.reactivate_existing = options.reactivate_existing ?? true

  return client.post(`/publications/${pubId}/subscriptions`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  })
}

export { createSubscription }
