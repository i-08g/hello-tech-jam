import { Suspense } from "react";
import GourmetsClient from "./client";
import { Shop } from "@/types";
 
async function fetchInitialShops(): Promise<Shop[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/shops`);
  if (!res.ok) {
    console.error("Failed to fetch initial shops:", res.statusText);
    return [];
  }
  return res.json();
}
 
export default async function GourmetsPage() {
  const initialShops = await fetchInitialShops();
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GourmetsClient initialShops={initialShops} />
    </Suspense>
  );
}