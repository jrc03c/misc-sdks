// Email regular expression from: https://emailregex.com/

/* eslint-disable */
const EMAIL_ADDRESS_PATTERN =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
/* eslint-enable */

function isAnEmailAddress(x) {
  return (
    typeof x === "string" &&
    !!standardizeEmailAddress(x).match(EMAIL_ADDRESS_PATTERN)
  )
}

function parseSafe(x) {
  try {
    return JSON.parse(x)
  } catch (e) {
    return x
  }
}

function standardizeEmailAddress(emailAddress) {
  return emailAddress.trim().toLowerCase()
}

export { isAnEmailAddress, parseSafe, standardizeEmailAddress }
