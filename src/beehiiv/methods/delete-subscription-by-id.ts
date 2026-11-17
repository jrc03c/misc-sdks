function deleteSubscriptionById(client, pubId, subId) {
  const path = `/publications/${pubId}/subscriptions/${subId}`
  return client.delete(path)
}

export { deleteSubscriptionById }
