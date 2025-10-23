import { MailchimpClientResponse } from "../response.mjs"

async function getListMemberStatus(listId, emailAddress) {
  const response = await this.getListMemberInfo(listId, emailAddress)

  return new MailchimpClientResponse({
    ...response,
    json: response.json.status,
    text: response.json.status,
  })
}

export { getListMemberStatus }
