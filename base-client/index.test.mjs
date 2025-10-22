import { BaseClient } from "./index.mjs"
import { BaseClientResponse } from "./response.mjs"
import { expect, test } from "@jrc03c/fake-jest"
import { pause } from "@jrc03c/pause"
import express from "express"

test("BaseClient", () => {
  return new Promise((resolve, reject) => {
    try {
      const app = express()
      const methods = {}
      const minTimeBetweenRequests = 100
      let lastTime = performance.now()
      let responseTrue

      app.use((request, response, next) => {
        const now = performance.now()

        if (now - lastTime < minTimeBetweenRequests) {
          return response.status(429).send("Too fast!")
        }

        lastTime = now
        next()
      })

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
        await pause(minTimeBetweenRequests * 1.5)

        const response = await client.get("/")
        expect(response instanceof BaseClientResponse).toBe(true)
        expect(response.endpoint).toBe(`http://localhost:${port}/`)
        expect(response.json).toBe(responseTrue)
        expect(response.method).toBe("GET")
        expect(response.status).toBe(200)
        expect(response.text).toBe(responseTrue.toString())
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["DELETE"]).toBe(false)
        await client.delete("/foo")
        expect(!!methods["DELETE"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["GET"]).toBe(false)
        await client.get("/foo")
        expect(!!methods["GET"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["HEAD"]).toBe(false)
        await client.head("/foo")
        expect(!!methods["HEAD"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["OPTIONS"]).toBe(false)
        await client.options("/foo")
        expect(!!methods["OPTIONS"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["PATCH"]).toBe(false)
        await client.patch("/foo")
        expect(!!methods["PATCH"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["POST"]).toBe(false)
        await client.post("/foo")
        expect(!!methods["POST"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        expect(!!methods["PUT"]).toBe(false)
        await client.put("/foo")
        expect(!!methods["PUT"]).toBe(true)
        await pause(minTimeBetweenRequests * 1.5)

        let encounteredAtLeastOne429Status = false

        for (let i = 0; i < 100; i++) {
          const response = await client.get("/")

          if (response.status === 429) {
            encounteredAtLeastOne429Status = true
            break
          }
        }

        expect(encounteredAtLeastOne429Status).toBe(true)

        server.close()
        resolve()
      })
    } catch (e) {
      return reject(e)
    }
  })
})
