function deactivateSubscriptionById(client, pubId, subId) {
  return client.updateSubscriptionById(pubId, subId, {
    unsubscribe: true,
  })
}

export { deactivateSubscriptionById }
