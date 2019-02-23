import * as got from "got";
import micro from "micro";
import listen = require("test-listen");
import { URL } from "url";
import handler = require("../main");

describe("GET /", () => {
  test("responds with value that is given at `message` query parameter", async () => {
    const server = micro(handler);
    const url = new URL("/", await listen(server));
    url.searchParams.set("message", "this is test!");
    const response = await got.get(url);

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(JSON.parse(response.body)).toEqual({
      data: { hello: "this is test!" },
      errors: []
    });

    server.close();
  });

  test("responds with redirection to /?message=world when `message` query parameter is missing", async () => {
    const server = micro(handler);
    const url = new URL("/", await listen(server));
    const response = await got.get(url, { followRedirect: false });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe("/?message=world");

    server.close();
  });
});

describe("GET /about", () => {
  test("responds with something", async () => {
    const server = micro(handler);
    const url = new URL("/about", await listen(server));
    const response = await got.get(url);

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(JSON.parse(response.body)).toEqual({
      data: { whoami: expect.any(String) },
      errors: []
    });

    server.close();
  });
});
