import { NextResponse } from "next/server";

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

async function fetchHotpepperData(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new APIError(response.status, `API request failed: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.results?.shop) {
    throw new APIError(404, "No shops found");
  }
  return data.results.shop;
}

function handleError(error: unknown): NextResponse {
  console.error("Error:", error);
  if (error instanceof APIError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
}

export async function GET(request: Request) {
  // request.url を使用せずに searchParams を取得
  const searchParams = new URLSearchParams(request.url.split("?")[1] || "");

  try {
    const key = process.env.HOTPEPPER_API_KEY;
    if (!key) {
      throw new APIError(500, "API key is not set");
    }

    const query = new URLSearchParams({
      key: key,
      format: "json",
      large_area: searchParams.get("large_area") || "Z098",
      budget: searchParams.get("budget") || "",
      count: "10",
      lat: searchParams.get("lat") || "",
      lng: searchParams.get("lng") || "",
      private_room: searchParams.get("private_room") || "0"
      // private_room: "1"

    });

    const keyword = searchParams.get("keyword");
    if (keyword) query.set("keyword", keyword);

    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${query.toString()}`;
    const data = await fetchHotpepperData(url);
    console.log(data)
    console.log(query.toString())
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleError(error);
  }
}