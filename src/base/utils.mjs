import { removeDiacriticalMarks } from "@jrc03c/js-text-tools"
import nodemailer from "nodemailer"

class GmailMessageSender {
  emailStandardizationOptions = null
  shouldStandardizeEmailAddresses = true
  transport = null

  constructor(data) {
    data = data || {}

    if (!data.user || !data.pass) {
      throw new Error(
        "The object passed into the `GmailMessageSender` constructor must have 'user' and 'pass' properties with string values representing a valid Gmail username and password!",
      )
    }

    this.emailStandardizationOptions =
      data.emailStandardizationOptions || this.emailStandardizationOptions

    this.shouldStandardizeEmailAddresses =
      data.shouldStandardizeEmailAddresses ??
      this.shouldStandardizeEmailAddresses

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

    if (this.shouldStandardizeEmailAddresses) {
      payload = structuredClone(payload)
      const fields = ["bcc", "cc", "from", "to"]

      for (const field of fields) {
        if (payload[field]) {
          payload[field] = toNodemailerAddressFormat(
            payload[field],
            true,
            this.emailStandardizationOptions,
          )
        }
      }
    }

    return console.log(payload)
    // return await this.transport.sendMail(payload)
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

  if (!x.includes("@")) {
    return x
  }

  options = options || {}

  // remove diacritical marks in username by default
  const shouldRemoveDiacriticalMarksInUsername =
    options.shouldRemoveDiacriticalMarksInUsername ?? true

  // do NOT remove diacritical marks in domain by default
  const shouldRemoveDiacriticalMarksInDomain =
    options.shouldRemoveDiacriticalMarksInDomain ?? false

  // do NOT remove periods in username by default
  const shouldRemovePeriodsInUsername =
    options.shouldRemovePeriodsInUsername ?? false

  // do NOT remove tags in username by default
  const shouldRemoveTagsInUsername = options.shouldRemoveTagsInUsername ?? false

  x = x.toLowerCase()
  x = x.replaceAll(/\s/g, "")

  const parts = x.split("@")
  let username = parts[0]
  let domain = parts.slice(1).join("@")

  if (shouldRemoveDiacriticalMarksInUsername) {
    username = removeDiacriticalMarks(username)
  }

  if (shouldRemoveDiacriticalMarksInDomain) {
    // eslint-disable-next-line no-control-regex
    const pattern = /[^\x00-\x7F]/

    domain = domain
      .split(".")
      .map(v => (pattern.test(v) ? new URL(`http://${v}`).hostname : v))
      .join(".")
  }

  if (shouldRemovePeriodsInUsername) {
    username = username.replaceAll(/\./g, "")
  }

  if (shouldRemoveTagsInUsername) {
    username = username.split("+")[0]
  }

  return username + "@" + domain
}

function toNodemailerAddressFormat(
  x,
  shouldStandardizeEmailAddress,
  emailStandardizationOptions,
) {
  const customSplit = x => {
    const out = []
    let isInQuotes = false
    let temp = ""

    for (let i = 0; i < x.length; i++) {
      const char = x[i]

      if (char === '"') {
        isInQuotes = !isInQuotes
        continue
      }

      if (char === "\\") {
        temp += char + (x[i + 1] || "")
        i++
        continue
      }

      if (char === "," && !isInQuotes) {
        out.push(temp.trim())
        temp = ""
      } else {
        temp += char
      }
    }

    if (temp.length > 0) {
      out.push(temp.trim())
    }

    return out
  }

  shouldStandardizeEmailAddress = shouldStandardizeEmailAddress ?? true

  const helper = x => {
    let address = ""
    let name = ""

    if (typeof x === "object") {
      if (x instanceof Array) {
        return x.map(v => helper(v))
      }

      address = x.address || address
      name = x.name || name
    } else if (typeof x === "string") {
      const subvalues = customSplit(x)

      if (subvalues.length > 1) {
        return subvalues.map(v => helper(v))
      } else {
        let sub = subvalues[0]
        const matches = sub.match(/"?.*?"?\s*<.*?>/gs)

        if (matches && matches.length > 0) {
          const match = matches[0]

          address = match
            .match(/<.*?>/gs)[0]
            .replace(/^</, "")
            .replace(/>$/, "")

          name = match
            .replace(/<.*?>/gs, "")
            .trim()
            .replace(/^"/, "")
            .replace(/"$/, "")
            .trim()
        } else {
          address = sub
        }
      }
    } else {
      throw new Error(
        `The value passed into the \`toNodemailerAddressFormat\` function must be a string or an object (with 'address' and (optionally) 'name' properties)!`,
      )
    }

    if (shouldStandardizeEmailAddress) {
      address = standardizeEmailAddress(address, emailStandardizationOptions)
    }

    return { address, name: name || address }
  }

  return helper(x)
}

export {
  GmailMessageSender,
  safeParse,
  standardizeEmailAddress,
  toNodemailerAddressFormat,
}
