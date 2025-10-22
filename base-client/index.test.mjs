import { BaseClient } from "./index.mjs"
import { BaseClientResponse } from "./response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import express from "express"

test("BaseClient", () => {
  return new Promise((resolve, reject) => {
    try {
      const app = express()
      let responseTrue

      app.get("/", (request, response) => {
        responseTrue = Math.random()
        return response.send(responseTrue)
      })

      const server = app.listen(0, async () => {
        const { port } = server.address()
        const client = new BaseClient({ baseUrl: `http://localhost:${port}` })
        const response = await client.get("/")
        expect(response instanceof BaseClientResponse).toBe(true)
        expect(response.endpoint).toBe(`http://localhost:${port}/`)
        expect(response.json).toBe(responseTrue)
        expect(response.method).toBe("GET")
        expect(response.status).toBe(200)
        expect(response.text).toBe(responseTrue.toString())
        server.close()
        resolve()
      })
    } catch (e) {
      return reject(e)
    }
  })
})
