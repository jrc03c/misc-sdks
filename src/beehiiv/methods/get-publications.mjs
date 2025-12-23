// https://developers.beehiiv.com/api-reference/publications/index

function getPublications(client, options) {
  // options include:
  // - direction (string; one of):
  //   - asc
  //   - desc
  // - expand (string; one of):
  //   - stat_active_free_subscriptions
  //   - stat_active_premium_subscriptions
  //   - stat_active_subscriptions
  //   - stat_average_click_rate
  //   - stat_average_open_rate
  //   - stat_total_clicked
  //   - stat_total_sent
  //   - stat_total_unique_opened
  //   - stats
  // - limit (integer; [1, 100]; default = 10)
  // - order_by (string; one of):
  //   - created
  //   - name
  // - page (integer)

  options = options || {}
  const queryParams = []

  if (options.expand) {
    queryParams.push(`expand=${encodeURIComponent(options.expand)}`)
  }

  if (options.limit) {
    queryParams.push(`limit=${encodeURIComponent(options.limit)}`)
  }

  if (options.page) {
    queryParams.push(`page=${encodeURIComponent(options.page)}`)
  }

  if (options.direction) {
    queryParams.push(`direction=${encodeURIComponent(options.direction)}`)
  }

  if (options.orderBy) {
    queryParams.push(`order_by=${encodeURIComponent(options.orderBy)}`)
  }

  const path =
    "/publications" +
    (queryParams.length > 0 ? "?" + queryParams.join("&") : "")

  return client.get(path)
}

export { getPublications }
