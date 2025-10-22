import { addMemberToList } from "./add-member-to-list.mjs"
import { addTagToMemberProfile } from "./add-tag-to-member-profile.mjs"
import { createSegmentForTag } from "./create-segment-for-tag.mjs"
import { deleteSegment } from "./delete-segment.mjs"
import { findTags } from "./find-tags.mjs"
import { getAllMembersInSegment } from "./get-all-members-in-segment.mjs"
import { getAllMembersWithTag } from "./get-all-members-with-tag.mjs"
import { getMemberInfo } from "./get-member-info.mjs"
import { getMemberStatus } from "./get-member-status.mjs"
import { getTagId } from "./get-tag-id.mjs"
import { pause } from "@jrc03c/pause"
import { removeMemberFromList } from "./remove-member-from-list.mjs"
import { removeTagFromMemberProfile } from "./remove-tag-from-member-profile.mjs"
import { setMemberInfo } from "./set-member-info.mjs"
import { setMemberStatus } from "./set-member-status.mjs"
import { urlPathJoin } from "@jrc03c/js-text-tools"

class MailchimpClient {
  apiKey = ""
  lastRequestTime = new Date(0)
  serverPrefix = ""
  timeBetweenRequests = 1000

  constructor(options) {
    options = options || {}

    this.apiKey = options.apiKey || this.apiKey
    this.serverPrefix = options.serverPrefix || this.serverPrefix

    this.timeBetweenRequests =
      options.timeBetweenRequests || this.timeBetweenRequests

    this.addMemberToList = addMemberToList.bind(this)
    this.addTagToMemberProfile = addTagToMemberProfile.bind(this)
    this.createSegmentForTag = createSegmentForTag.bind(this)
    this.deleteSegment = deleteSegment.bind(this)
    this.findTags = findTags.bind(this)
    this.getAllMembersInSegment = getAllMembersInSegment.bind(this)
    this.getAllMembersWithTag = getAllMembersWithTag.bind(this)
    this.getMemberInfo = getMemberInfo.bind(this)
    this.getMemberStatus = getMemberStatus.bind(this)
    this.getTagId = getTagId.bind(this)
    this.removeMemberFromList = removeMemberFromList.bind(this)
    this.removeTagFromMemberProfile = removeTagFromMemberProfile.bind(this)
    this.setMemberInfo = setMemberInfo.bind(this)
    this.setMemberStatus = setMemberStatus.bind(this)
  }

  get baseUrl() {
    return `https://${this.serverPrefix}.api.mailchimp.com/3.0`
  }

  async sendRequest(path, options) {
    while (new Date() - this.lastRequestTime < this.timeBetweenRequests) {
      await pause(this.timeBetweenRequests / 10)
    }

    this.lastRequestTime = new Date()
    options = options || {}

    if (!options.headers) {
      options.headers = {}
    }

    if (!options.headers.Authorization) {
      options.headers.Authorization = `Bearer ${this.apiKey}`
    }

    return fetch(urlPathJoin(this.baseUrl, path), options)
  }
}

export { MailchimpClient }
