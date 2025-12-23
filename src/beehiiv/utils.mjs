import { copy } from "@jrc03c/js-math-tools"
import { snakeify } from "@jrc03c/js-text-tools"

function renameKeys(x, fn) {
  if (typeof x === "object" && x !== null) {
    if (x instanceof Date) {
      return new Date(x)
    } else if (x instanceof Array) {
      return x.map(v => renameKeys(v, fn))
    } else {
      const out = safeCopy(x)

      Object.keys(out).forEach(key => {
        const newKey = fn(key)
        out[newKey] = renameKeys(out[key], fn)

        if (newKey !== key) {
          delete out[key]
        }
      })

      return out
    }
  } else {
    return x
  }
}

function robustSnakeify(x) {
  return snakeify(uncamelify(x))
}

function safeCopy(x) {
  // This *should* only fail if two conditions are met:
  // 1. A read-only property is defined on `x`; and...
  // 2. That read-only property also creates a circularity in `x`.

  try {
    return copy(x)
  } catch (e) {}

  try {
    structuredClone(x)
  } catch (e) {}

  try {
    return x.toObject()
  } catch (e) {}

  if (typeof x === "object") {
    if (x === null) {
      return x
    }

    if (x instanceof Date) {
      return new Date(x)
    }

    if (x instanceof Array) {
      const out = []

      for (let i = 0; i < x.length; i++) {
        out.push(safeCopy(x[i]))
      }

      return out
    }

    const out = {}
    const keys = Object.keys(x)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      out[key] = safeCopy(x[key])
    }

    return out
  }

  return x
}

function snakeifyKeys(x) {
  return renameKeys(x, v => snakeify(uncamelify(v)))
}

function uncamelify(x) {
  let out = ""

  for (let i = 0; i < x.length; i++) {
    const char = x[i]

    if (char.match(/[A-Z]/)) {
      out += (i > 0 ? " " : "") + char.toLowerCase()
    } else if (char.match(/\d/)) {
      const digits = x.slice(i).match(/\d+/g)[0]
      out += (i > 0 ? " " : "") + digits
      i += digits.length - 1
    } else {
      out += char
    }
  }

  return out
}

export { renameKeys, robustSnakeify, safeCopy, snakeifyKeys, uncamelify }
