import { createMiddyfiedGeneralEventHandler } from "@jaykingson/middyfied-lambda-handler";

const middyHandler = async (event: any) => {
  console.log("lambda was called...");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda!",
    }),
  };
};

export const handler = createMiddyfiedGeneralEventHandler({
  lambdaHandler: middyHandler,
});
