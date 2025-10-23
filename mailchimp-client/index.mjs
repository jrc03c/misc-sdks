import { addMemberToList } from "./methods/add-member-to-list.mjs"
import { archiveListMember } from "./methods/archive-list-member.mjs"
import { BaseClient } from "../base-client/index.mjs"
import { batchAddMembersToList } from "./methods/batch-add-members-to-list.mjs"
import { getListInfo } from "./methods/get-list-info.mjs"
import { getListMemberInfo } from "./methods/get-list-member-info.mjs"
import { getListMemberStatus } from "./methods/get-list-member-status.mjs"
import { MailchimpClientResponse } from "./response.mjs"
import { searchListTags } from "./methods/search-list-tags.mjs"
import { searchMembers } from "./methods/search-members.mjs"
import { updateListMemberInfo } from "./methods/update-list-member-info.mjs"

class MailchimpClient extends BaseClient {
  static Status = {
    ARCHIVED: "archived",
    CLEANED: "cleaned",
    PENDING: "pending",
    SUBSCRIBED: "subscribed",
    TRANSACTIONAL: "transactional",
    UNSUBSCRIBED: "unsubscribed",
  }

  apiKey = ""
  apiVersion = "3.0"
  datacenter = "us0"

  constructor(data) {
    data = data || {}
    super(data)

    if (!data.apiKey) {
      throw new Error(
        "The object passed into the `MailchimpClient` constructor must have an 'apiKey' property with a string value representing a valid Mailchimp API key!",
      )
    }

    this.apiKey = data.apiKey
    this.apiVersion = data.apiVersion || this.apiVersion
    this.datacenter = data.datacenter || this.apiKey.split("-").at(-1).trim()

    this.baseUrl =
      data.baseUrl ||
      `https://${this.datacenter}.api.mailchimp.com/${this.apiVersion}`

    // bind methods
    this.addMemberToList = addMemberToList.bind(this)
    this.archiveListMember = archiveListMember.bind(this)
    this.batchAddMembersToList = batchAddMembersToList.bind(this)
    this.getListInfo = getListInfo.bind(this)
    this.getListMemberInfo = getListMemberInfo.bind(this)
    this.getListMemberStatus = getListMemberStatus.bind(this)
    this.searchListTags = searchListTags.bind(this)
    this.searchMembers = searchMembers.bind(this)
    this.updateListMemberInfo = updateListMemberInfo.bind(this)
  }

  ping() {
    return this.get("/ping")
  }

  async send(path, options) {
    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers["Authorization"]) {
      options.headers["Authorization"] =
        `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString("base64")}`
    }

    return new MailchimpClientResponse(await super.send(path, options))
  }
}

export { MailchimpClient }
