import { IncomingMessage, ServerResponse } from "http";
import { send } from "micro";
import { URLSearchParams } from "url";
import { graphql, buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

async function main(request: IncomingMessage, response: ServerResponse) {
  const pathname = request.url!.split("?")[0];
  const searchParams = new URLSearchParams(
    request.url!.includes("?")
      ? request.url!.slice(request.url!.indexOf("?"))
      : ""
  );

  if (request.method === "GET" && pathname === "/graphql" && searchParams.has("query")) {
    const query = searchParams.get("query")!;

    return graphql(schema, query, root);
  }

  return send(response, 404, {
    data: null,
    errors: ["NOT_FOUND"]
  });
}

export = main;
