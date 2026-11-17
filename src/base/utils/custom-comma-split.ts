function customCommaSplit(x: string) {
  // splits along commas that are *not* inside (double) quotation marks; note
  // that it strips leading and trailing whitespace from results
  const out = []
  let isInQuotes = false
  let temp = ""

  for (let i = 0; i < x.length; i++) {
    const char = x[i]

    if (char === '"') {
      isInQuotes = !isInQuotes
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

  out.push(temp.trim())
  return out
}

export { customCommaSplit }
