// NOTE: This function only *archives* the user; it does not permanently delete
// them from a list. To permanently delete a user from a list, use the website.

async function removeMemberFromList(listId, emailAddress) {
  const response = await this.sendRequest(
    `/lists/${listId}/members/${emailAddress}`,
    { method: "DELETE" },
  )

  if (response.status < 300) {
    return true
  } else {
    throw new Error(await response.text())
  }
}

export { removeMemberFromList }
