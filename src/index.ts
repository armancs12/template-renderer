import { getScript } from "./client";
import { compileTemplate } from "./compiler";

addEventListener("fetch", (event: any) => {
  event.respondWith(handleRequest(event.request));
});

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default function searchParamsToJSON(searchParams: URLSearchParams) {
  const params = {}

  for (const key of searchParams.keys()) {
      params[key] = searchParams.get(key);
  }

  return params;
}

export async function handleRequest(request: Request) {
  const { searchParams, pathname, host, protocol } = new URL(request.url);

  if (pathname === "/script") {
    return new Response(getScript(`${protocol}//${host}/`), {
      headers: {
        ...headers,
        "Content-Type": "application/javascript"
      }
    });
  }

  const params = searchParamsToJSON(searchParams);

  const htmlTemplate = await request.text() ?? "";
  const compiledTemplate = compileTemplate(htmlTemplate, params);

  return new Response(compiledTemplate, { headers });
}
