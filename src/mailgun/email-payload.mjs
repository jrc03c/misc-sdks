class MailgunEmailPayload {
  static isPayloadish(x) {
    return (
      x instanceof MailgunEmailPayload ||
      (typeof x === "object" && !!x.to && !!x.subject)
    )
  }

  // NOTE: Only the `to` and `subject` values are required
  _replyTo = ""
  from = ""
  html = ""
  subject = ""
  text = ""
  to = []

  constructor(data) {
    data = data || {}

    this.from = data.from || this.from

    if (data.html) {
      this.html = data.html

      if (data.text) {
        this.text = data.text
      } else {
        this.text = data.html.replaceAll(/<.*?>/g, "")
      }
    } else if (data.text) {
      this.text = data.text
      this.html = data.text
    }

    this.replyTo = data.replyTo || this.replyTo

    if (data.subject) {
      this.subject = data.subject
    } else {
      throw new Error(
        "You must include a 'subject' property on the options object passed into the `MailgunEmailPayload` constructor!",
      )
    }

    if (data.to) {
      if (data.to instanceof Array) {
        this.to = data.to
      } else if (typeof data.to === "string") {
        if (data.to.includes(",")) {
          this.to = data.to.split(",")
        } else {
          this.to = [data.to]
        }
      } else {
        throw new Error(
          "The 'to' property on the options object passed into the `MailgunEmailPayload` constructor must have a value that's either (1) a string representing a recipient email address or (2) an array of strings representing recipient email addresses!",
        )
      }
    } else {
      throw new Error(
        "You must include a 'to' property on the options object passed into the `MailgunEmailPayload` constructor!",
      )
    }
  }

  get replyTo() {
    if (!this._replyTo) {
      this._replyTo = this.from.match(/<.*?>/g)
        ? this.from.replace(/.*?<(.*?)>/g, "$1")
        : this.from
    }

    return this._replyTo
  }

  set replyTo(v) {
    this._replyTo = v
  }

  toFormData() {
    const out = new FormData()
    out.set("from", this.from)
    out.set("html", this.html)
    out.set("h:reply-to", this.replyTo)
    out.set("subject", this.subject)
    out.set("text", this.text)
    out.set("to", this.to.join(","))
    return out
  }
}

export { MailgunEmailPayload }
