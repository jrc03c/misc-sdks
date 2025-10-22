function safeParse(x) {
  try {
    return JSON.parse(x)
  } catch (e) {
    return x
  }
}

export { safeParse }
