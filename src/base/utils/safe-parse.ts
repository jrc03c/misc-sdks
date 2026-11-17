function safeParse(x: string): object | string {
  try {
    return JSON.parse(x)
  } catch (e) {
    return x
  }
}

export { safeParse }
