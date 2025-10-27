import { MailchimpClientResponse } from "../response.mjs"

async function getListMemberStatus(listId, emailAddress) {
  const response = await this.getListMemberInfo(listId, emailAddress)

  const status =
    response.status === 404
      ? this.constructor.MemberStatus.NOT_FOUND
      : response.json.status

  return new MailchimpClientResponse({
    ...response,
    json: status,
    text: status,
  })
}

export { getListMemberStatus }
