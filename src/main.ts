import { IncomingMessage, ServerResponse } from "http";
import { send } from "micro";
import { URLSearchParams } from "url";

const whoami = process.env.DADDY_WHOAMI || "unknown";

async function main(request: IncomingMessage, response: ServerResponse) {
  const pathname = request.url!.split("?")[0];
  const searchParams = new URLSearchParams(
    request.url!.includes("?")
      ? request.url!.slice(request.url!.indexOf("?"))
      : ""
  );

  if (request.method === "GET" && pathname === "/") {
    if (searchParams.has("message")) {
      return send(response, 200, {
        data: { hello: searchParams.get("message")! },
        errors: []
      });
    } else {
      response.setHeader("location", "/?message=world");

      return send(response, 302);
    }
  }

  if (request.method === "GET" && pathname === "/about") {
    return send(response, 200, {
      data: { whoami },
      errors: []
    });
  }

  return send(response, 404, {
    data: null,
    errors: ["NOT_FOUND"]
  });
}

export = main;
