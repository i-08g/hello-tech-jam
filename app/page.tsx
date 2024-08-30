"use client";

import { useRouter } from "next/navigation";
import { Shop } from "@/types";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";
import { Genre } from "../components/genre";

interface ServiceArea {
  code: string;
  name: string;
}

async function fetchShops(keyword?: string, budget?: string, area?: string, privateRoom?: string, lat?: string, lng?: string, count?: string): Promise<Shop[]> {
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (budget) query.set("budget", budget);
  if (area) query.set("large_area", area);
  if (privateRoom) query.set("private_room", privateRoom);
  console.log(query.toString(), "🤖")
  if (lat) query.set("lat", lat);
  if (lng) query.set("lng", lng);
  if (count) query.set("count", count);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
    if (!res.ok) {
      console.error(`Failed to fetch shops: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data; // 最初に全データを取得
    // return privateRoom ? data.filter((shop: Shop) => shop.private_room === "1") : data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch error:", errorMessage);
    return [];
  }
}

async function fetchAreas(): Promise<ServiceArea[]> {
  try {
    const res = await fetch("/api/areas");
    if (!res.ok) {
      throw new Error("Failed to fetch areas");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching areas:", error);
    return [];
  }
}

async function fetchLunchShops(): Promise<Shop[]> {
  const query = new URLSearchParams({
    range: "1",
    large_area: "Z098", // 沖縄県
    budget: "B001",     // 1501~2000円
    count: "5"
  });

  try {
    const res = await fetch(`/api/shops?${query.toString()}`);
    if (!res.ok) {
      console.error(`Failed to fetch lunch shops: ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch error:", errorMessage);
    return [];
  }
}

async function fetchDinnerShops(): Promise<Shop[]> {
  const query = new URLSearchParams({
    range: "1",
    large_area: "Z098", // 沖縄県
    budget: "B003",     // 3001~4000円
    count: "5"
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
    if (!res.ok) {
      console.error(`Failed to fetch dinner shops: ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch error:", errorMessage);
    return [];
  }
}

async function fetchPopularShops(lat: number, lng: number): Promise<Shop[]> {
  const query = new URLSearchParams({
    lat: "26.223361",
    lng: "127.695611",
    range: "1",
    order: "4", // 4: オススメ
    count: "5"
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
    if (!res.ok) {
      console.error(`Failed to fetch popular shops: ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch error:", errorMessage);
    return [];
  }
}

export default function GourmetsPage({
  searchParams,
}: {
  searchParams: { keyword?: string };
}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [lunchShops, setLunchShops] = useState<Shop[]>([]);
  const [dinnerShops, setDinnerShops] = useState<Shop[]>([]);
  const [popularShops, setPopularShops] = useState<Shop[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("Z098");
  const [budget, setBudget] = useState<string>("");
  const [budgetLabel, setBudgetLabel] = useState<string>("予算を選択");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true); // 初期ロード状態のフラグ
  const router = useRouter();
  const lat = "26.223361";
  const lng = "127.695611";

  useEffect(() => {
    const fetchServiceAreas = async () => {
      const areasData = await fetchAreas();
      setAreas(areasData);
    };

    const fetchInitialShops = async () => {
      const shopsData = await fetchShops(searchParams.keyword, budget, selectedArea, privateRoom);
      setShops(shopsData);
      setInitialLoad(false);
    };

    fetchServiceAreas();
    fetchInitialShops();
  }, [searchParams.keyword, budget, selectedArea, privateRoom]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const shopsData = await fetchShops(searchParams.keyword, budget, selectedArea, privateRoom);
    const filteredShops = privateRoom ? shopsData.filter((shop: Shop) => shop.private_room === "1") : shopsData;
    setShops(filteredShops);


    const query = new URLSearchParams({
      keyword: searchParams.keyword || "",
      area: selectedArea,
      budget: budget,
      private_room: privateRoom ? "1" : "0",
    }).toString();

    console.log(query.toString(), "🍌")
    // alert("test")
    router.push(`/results?${query}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-36 px-8 md:px-12 lg:px-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{selectedArea}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>エリアを選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup onValueChange={(selectedArea) => {
              setSelectedArea(selectedArea);
            }}>
              <DropdownMenuRadioItem value="Z098">沖縄</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{budgetLabel}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>予算を選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              onValueChange={(selectedBudget) => {
                setBudget(selectedBudget);
                const selectedLabel = budgetOptions.find(
                  (option) => option.value === selectedBudget
                )?.label;
                if (selectedLabel) setBudgetLabel(selectedLabel);
              }}>
              {budgetOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              checked={privateRoom}
              onChange={(e) => setPrivateRoom(e.target.checked)}
            />
            個室あり
          </label>
        </div>

        <Button type="submit">検索</Button>
      </form>

      <div className="space-y-8 py-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">近くのお店</h2>
          <Genre shops={shops} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">ランチに最適2000円以下</h2>
          <Genre shops={lunchShops} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">ディナーに最適4000円以下</h2>
          <Genre shops={dinnerShops} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">注目度・アクセス数が多い</h2>
          <Genre shops={popularShops} />
        </section>
      </div>
    </div>
  );
}

const budgetOptions = [
  { value: "B009", label: "~500円" },
  { value: "B010", label: "501~1000円" },
  { value: "B011", label: "1001~1500円" },
  { value: "B001", label: "1501~2000円" },
  { value: "B002", label: "2001~3000円" },
  { value: "B003", label: "3001~4000円" },
  { value: "B008", label: "4001~5000円" },
  { value: "B004", label: "5001~7000円" },
  { value: "B005", label: "7001~10000円" },
  { value: "B006", label: "10000~15000円" },
  { value: "B012", label: "15001~20000円" },
  { value: "B013", label: "20001~30000円" },
  { value: "B014", label: "30001~" },
  // 他の予算オプション
]
