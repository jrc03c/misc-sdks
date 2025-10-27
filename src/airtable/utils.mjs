function superEncodeURIComponent(x) {
  // note: this uses php-style array and object encodings

  const helper = x => {
    if (typeof x === "object") {
      if (x === null) {
        return ["null"]
      }

      if (x instanceof Array) {
        const out = []

        for (let i = 0; i < x.length; i++) {
          out.push(`[]=${helper(x[i])}`)
        }

        return out
      }

      const keys = Object.keys(x)
      const out = []

      for (let i = 0; i < keys.length; i++) {
        const key = helper(keys[i])
        const values = helper(x[keys[i]])

        for (let j = 0; j < values.length; j++) {
          const value = values[j]

          if (value.match(/^\[\]=/)) {
            out.push(key + value)
          } else if (value.match(/.+=.+/)) {
            out.push(key + "." + value)
          } else {
            out.push(key + "=" + value)
          }
        }
      }

      return out
    }

    try {
      return [encodeURIComponent(x)]
    } catch (e) {
      return [x]
    }
  }

  return helper(x).join("&")
}

export { superEncodeURIComponent }
