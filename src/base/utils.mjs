import { removeDiacriticalMarks } from "@jrc03c/js-text-tools"
import nodemailer from "nodemailer"

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

function standardizeEmailAddress(x, options) {
  // NOTE: This function does not confirm that the string it receives is a valid
  // email address!

  if (typeof x !== "string") {
    throw new Error(
      "The value passed into the `standardizeEmailAddress` function must be a string!",
    )
  }

  options = options || {}

  // remove diacritical marks by default
  const shouldRemoveDiacriticalMarks =
    options.shouldRemoveDiacriticalMarks ?? true

  // do NOT remove periods in username by default
  const shouldRemovePeriodsInUsername =
    options.shouldRemovePeriodsInUsername ?? false

  // do NOT remove tags in username by default
  const shouldRemoveTagsInUsername = options.shouldRemoveTagsInUsername ?? false

  x = x.toLowerCase()
  x = x.replaceAll(/\s/g, "")

  if (shouldRemoveDiacriticalMarks) {
    x = removeDiacriticalMarks(x)
  }

  if (shouldRemovePeriodsInUsername) {
    const parts = x.split("@")
    const username = parts[0].replaceAll(/\./g, "")
    x = username + "@" + parts.slice(1).join("@")
  }

  if (shouldRemoveTagsInUsername) {
    const parts = x.split("@")
    const username = parts[0].split("+")[0]
    x = username + "@" + parts.slice(1).join("@")
  }

  return x
}

export { GmailMessageSender, safeParse, standardizeEmailAddress }
