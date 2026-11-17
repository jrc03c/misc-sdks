import { BaseClient } from "../base/index.mjs"
import { BeehiivClientResponse } from "./response.mjs"
import { createSubscription } from "./methods/create-subscription.mjs"
import { deactivateSubscriptionByEmailAddress } from "./methods/deactivate-subscription-by-email-address.mjs"
import { deactivateSubscriptionById } from "./methods/deactivate-subscription-by-id.mjs"
import { deleteSubscriptionByEmailAddress } from "./methods/delete-subscription-by-email-address.mjs"
import { deleteSubscriptionById } from "./methods/delete-subscription-by-id.mjs"
import { getPublications } from "./methods/get-publications.mjs"
import { getSubscriptionByEmailAddress } from "./methods/get-subscription-by-email-address.mjs"
import { getSubscriptionById } from "./methods/get-subscription-by-id.mjs"
import { getSubscriptions } from "./methods/get-subscriptions.mjs"
import { updateSubscriptionByEmailAddress } from "./methods/update-subscription-by-email-address.mjs"
import { updateSubscriptionById } from "./methods/update-subscription-by-id.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

const BEEHIIV_API_VERSION = 2
const BEEHIIV_BASE_URL = "https://api.beehiiv.com"

class BeehiivClient extends BaseClient {
  apiKey = null
  apiVersion = BEEHIIV_API_VERSION
  emailAddressStandardizationOptions = null
  shouldStandardizeEmailAddresses = true

  constructor(data) {
    data = data || {}

    data.baseUrl =
      data.baseUrl ||
      urlPathJoin(
        BEEHIIV_BASE_URL,
        "v" + (data.apiVersion || BEEHIIV_API_VERSION),
      )

    super(data)
    this.apiKey = data.apiKey || this.apiKey
    this.apiVersion = data.apiVersion || this.apiVersion

    this.emailAddressStandardizationOptions =
      data.emailAddressStandardizationOptions ||
      this.emailAddressStandardizationOptions

    this.shouldStandardizeEmailAddresses =
      data.shouldStandardizeEmailAddresses ??
      this.shouldStandardizeEmailAddresses
  }

  createSubscription() {
    return createSubscription(this, ...arguments)
  }

  deactivateSubscriptionByEmailAddress() {
    return deactivateSubscriptionByEmailAddress(this, ...arguments)
  }

  deactivateSubscriptionById() {
    return deactivateSubscriptionById(this, ...arguments)
  }

  deleteSubscriptionByEmailAddress() {
    return deleteSubscriptionByEmailAddress(this, ...arguments)
  }

  deleteSubscriptionById() {
    return deleteSubscriptionById(this, ...arguments)
  }

  getPublications() {
    return getPublications(this, ...arguments)
  }

  getSubscriptionByEmailAddress() {
    return getSubscriptionByEmailAddress(this, ...arguments)
  }

  getSubscriptionById() {
    return getSubscriptionById(this, ...arguments)
  }

  getSubscriptions() {
    return getSubscriptions(this, ...arguments)
  }

  async send(path, options) {
    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers["Authorization"]) {
      options.headers["Authorization"] = `Bearer ${this.apiKey}`
    }

    return new BeehiivClientResponse(await super.send(path, options))
  }

  updateSubscriptionByEmailAddress() {
    return updateSubscriptionByEmailAddress(this, ...arguments)
  }

  updateSubscriptionById() {
    return updateSubscriptionById(this, ...arguments)
  }
}

export { BeehiivClient, BeehiivClientResponse }
