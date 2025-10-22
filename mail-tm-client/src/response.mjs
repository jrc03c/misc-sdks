class MailTmClientResponse {
  data = null
  method = "GET"
  path = "/"
  status = 0

  constructor(data) {
    data = data || {}
    this.data = data.data || this.data
    this.method = data.method || this.method
    this.path = data.path || this.path
    this.status = data.status || this.status
  }
}

export { MailTmClientResponse }
