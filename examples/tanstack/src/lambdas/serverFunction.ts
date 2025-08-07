import { handler as serverHandler } from "../../.output/server/index.mjs";

// Use programmatically
// const { statusCode, headers, body } = serverHandler({ rawPath: "/" });
export const handler = async (event: any, context: any) => {
  console.log("Event:", event);
  console.log("Context:", context);
  const { statusCode, headers, body } = await serverHandler({
    rawPath: event.rawPath,
    rawQuery: event.rawQuery,
    headers: event.headers,
    body: event.body,
  });

  return {
    statusCode,
    headers,
    body,
  };
};
