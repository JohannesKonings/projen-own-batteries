"use strict";
// Lambda@Edge origin-request function to SigV4-sign requests to a Lambda Function URL (AWS_IAM)
// Signs using the edge function's IAM role credentials.
const crypto = require("crypto");

function formatAmzDate(date) {
  // YYYYMMDD'T'HHMMSS'Z'
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function formatDateStamp(date) {
  // YYYYMMDD
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate())
  );
}

function sha256Hex(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function hmac(key, data, encoding) {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest(encoding);
}

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers || {};

  // Remove x-forwarded-for to avoid signature mismatch
  delete headers["x-forwarded-for"];

  // Determine origin host (the Function URL domain)
  const originHost = (request.origin && request.origin.custom && request.origin.custom.domainName) || (headers["host"] && headers["host"][0] && headers["host"][0].value);
  if (!originHost) {
    console.error("[edge-signer] No origin host to sign for");
    return request;
  }

  // Region from Function URL host: <id>.lambda-url.<region>.on.aws
  let region = undefined;
  const m = originHost.match(/\.lambda-url\.([a-z0-9-]+)\.on\.aws$/);
  if (m && m[1]) {
    region = m[1];
  } else {
    // Fallback parser (legacy split)
    const hostParts = originHost.split(".");
    if (hostParts.length >= 4 && hostParts[1] === "lambda-url") {
      region = hostParts[2];
    }
  }
  if (!region) {
    console.error(`[edge-signer] Could not derive region from originHost=${originHost}`);
    return request;
  }
  console.log(`[edge-signer] originHost=${originHost}, region=${region}`);

  // Preserve full path + query
  const canonicalUri = request.uri || "/";
  const canonicalQueryString = request.querystring || "";

  // Body hashing
  let payload = "";
  if (request.body && request.body.data) {
    const encoding = request.body.encoding || "text";
    payload = encoding === "base64" ? Buffer.from(request.body.data, "base64") : Buffer.from(request.body.data, "utf8");
  }
  const payloadHash = sha256Hex(payload);

  // Date headers
  const now = new Date();
  const amzDate = formatAmzDate(now);
  const dateStamp = formatDateStamp(now);

  // Required headers for signing
  const signedHeadersList = ["host", "x-amz-date"];
  const canonHeaders = {
    host: originHost,
    "x-amz-date": amzDate,
  };
  // If the viewer sent a content-type, include it in the signature
  const ct = headers["content-type"]?.[0]?.value || headers["Content-Type"]?.[0]?.value;
  if (ct) {
    canonHeaders["content-type"] = ct;
    signedHeadersList.push("content-type");
  }

  // Session token if present
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;
  if (!accessKeyId || !secretAccessKey) {
    console.warn("Edge credentials not resolved; request will likely fail (no signature)");
    return request;
  }
  if (sessionToken) {
    canonHeaders["x-amz-security-token"] = sessionToken;
    signedHeadersList.push("x-amz-security-token");
  }

  // Include any additional headers that must be signed (none required here)

  // Build canonical headers string
  const canonicalHeaders = signedHeadersList
    .map((h) => `${h}:${String(canonHeaders[h]).trim()}`)
    .join("\n") + "\n";

  const signedHeaders = signedHeadersList.join(";");

  const canonicalRequest = [
    request.method || "GET",
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/lambda/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac("AWS4" + secretAccessKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, "lambda");
  const kSigning = hmac(kService, "aws4_request");
  const signature = hmac(kSigning, stringToSign, "hex");

  const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // Rebuild headers back into CF format lower-cased keys
  request.headers = request.headers || {};
  request.headers["host"] = [{ key: "Host", value: originHost }];
  request.headers["x-amz-date"] = [{ key: "x-amz-date", value: amzDate }];
  if (sessionToken) {
    request.headers["x-amz-security-token"] = [
      { key: "x-amz-security-token", value: sessionToken },
    ];
  }
  request.headers["authorization"] = [
    { key: "Authorization", value: authorizationHeader },
  ];

  return request;
};
