import { customCommaSplit } from "./custom-comma-split"
import { extractEmailAddresses } from "@jrc03c/js-text-tools"
import { type NodemailerAddress } from "./nodemailer-address"

const NAME_AND_ADDRESS_PATTERN = /^"?(.*?)"?\s*<(.*?@.*?)>$/g

function toNodemailerAddressArray(
  x: object | string | string[],
): NodemailerAddress[] {
  if (typeof x === "object") {
    if (x === null) {
      return []
    }

    const out: NodemailerAddress[] = []

    for (const value of Object.values(x)) {
      out.push(...toNodemailerAddressArray(value))
    }

    return out
  }

  if (typeof x === "string") {
    const parts = customCommaSplit(x)
    const out: NodemailerAddress[] = []

    for (const part of parts) {
      const matches = part.match(NAME_AND_ADDRESS_PATTERN)

      if (matches && matches.length > 0) {
        const address = part.replace(NAME_AND_ADDRESS_PATTERN, "$2").trim()
        const name = part.replace(NAME_AND_ADDRESS_PATTERN, "$1").trim()
        out.push({ address, name })
      } else {
        const address = extractEmailAddresses(part)[0].trim()
        const name = (part.split(address)[0] ?? "").trim()
        out.push({ address, name })
      }
    }

    return out
  }

  return []
}

export { toNodemailerAddressArray }
