import * as got from "got";
import micro from "micro";
import listen = require("test-listen");
import { URL } from "url";
import handler = require("../main");

describe("GET /graphql", () => {
  test("responds graphql data", async () => {
    const server = micro(handler);
    const url = new URL("/graphql?query={hello}", await listen(server));
    const response = await got.get(url);

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(JSON.parse(response.body)).toEqual({
      data: { "hello": "Hello world!"}
    });
  });
});
