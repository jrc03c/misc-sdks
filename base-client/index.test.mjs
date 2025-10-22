import { BaseClient } from "./index.mjs"
import { BaseClientResponse } from "./response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import express from "express"

test("BaseClient", () => {
  return new Promise((resolve, reject) => {
    try {
      const app = express()
      const methods = {}
      let responseTrue

      app.get("/", (request, response) => {
        responseTrue = Math.random()
        return response.send(responseTrue)
      })

      app.use("/foo", (request, response) => {
        methods[request.method] = true
        return response.send()
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

        expect(!!methods["DELETE"]).toBe(false)
        await client.delete("/foo")
        expect(!!methods["DELETE"]).toBe(true)

        expect(!!methods["GET"]).toBe(false)
        await client.get("/foo")
        expect(!!methods["GET"]).toBe(true)

        expect(!!methods["HEAD"]).toBe(false)
        await client.head("/foo")
        expect(!!methods["HEAD"]).toBe(true)

        expect(!!methods["OPTIONS"]).toBe(false)
        await client.options("/foo")
        expect(!!methods["OPTIONS"]).toBe(true)

        expect(!!methods["PATCH"]).toBe(false)
        await client.patch("/foo")
        expect(!!methods["PATCH"]).toBe(true)

        expect(!!methods["POST"]).toBe(false)
        await client.post("/foo")
        expect(!!methods["POST"]).toBe(true)

        expect(!!methods["PUT"]).toBe(false)
        await client.put("/foo")
        expect(!!methods["PUT"]).toBe(true)

        server.close()
        resolve()
      })
    } catch (e) {
      return reject(e)
    }
  })
})
