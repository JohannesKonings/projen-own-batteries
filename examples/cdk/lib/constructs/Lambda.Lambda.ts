const handler = async (event: undefined, context: undefined) => {
  console.log("lambda was called...");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Lambda!",
    }),
  };
};
module.exports = { handler };
