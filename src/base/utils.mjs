import nodemailer from "nodemailer"

function convertQueryParamsObjectToString(obj) {
  // note:
  // - automatically passes keys through `encodeURIComponent`
  // - automatically passes values through `encodeURIComponent` only if they're
  //   strings
  // - ignores undefined values

  const keys = Object.keys(obj)
  const temp = []

  for (let i = 0; i < keys.length; i++) {
    const key = encodeURIComponent(keys[i])
    let value = obj[key]
    const type = typeof value

    if (type === "undefined") {
      continue
    }

    if (type === "string") {
      value = encodeURIComponent(value)
    }

    temp.push(`${key}=${value}`)
  }

  return temp.join("&")
}

class GmailMessageSender {
  transport = null

  constructor(data) {
    data = data || {}

    if (!data.user || !data.pass) {
      throw new Error(
        "The object passed into the `GmailMessageSender` constructor must have 'user' and 'pass' properties with string values representing a valid Gmail username and password!",
      )
    }

    this.transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: data.user, pass: data.pass },
    })
  }

  async send(payload) {
    // docs: https://nodemailer.com/message#common-fields
    // `payload` is an object with these possible fields:
    // - attachments
    // - bcc
    // - cc
    // - from
    // - html
    // - subject
    // - text
    // - to
    return await this.transport.sendMail(payload)
  }
}

function safeParse(x) {
  try {
    return JSON.parse(x)
  } catch (e) {
    return x
  }
}

export { convertQueryParamsObjectToString, GmailMessageSender, safeParse }
