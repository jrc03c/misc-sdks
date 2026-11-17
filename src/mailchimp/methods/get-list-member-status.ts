import { MailchimpClientResponse } from "../response.mjs"

async function getListMemberStatus(client, listId, emailAddress) {
  const response = await client.getListMemberInfo(listId, emailAddress)

  const status =
    response.status === 404
      ? client.constructor.MemberStatus.NOT_FOUND
      : response.json.status

  return new MailchimpClientResponse({
    ...response,
    json: status,
    text: status,
  })
}

export { getListMemberStatus }
