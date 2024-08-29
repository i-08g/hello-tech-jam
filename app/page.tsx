"use client";

import { useRouter } from "next/navigation";
import { Shop } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

async function fetchShops(keyword?: string, budget?: string, area?: string, privateRoom?: boolean): Promise<Shop[]> {
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (budget) query.set("budget", budget);
  if (area) query.set("large_area", area);
  if (privateRoom) query.set("private_room", "1");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
    if (!res.ok) {
      console.error(`Failed to fetch shops: ${res.status} ${res.statusText}`);
      return [];
    }
    return await res.json();
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
    large_area: "Z098", // 沖縄県
    budget: "B001",     // 1501~2000円
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
    );
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

export default function GourmetsPage({
  searchParams,
}: {
  searchParams: { keyword?: string };
}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [lunchShops, setLunchShops] = useState<Shop[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("Z098");
  const [budget, setBudget] = useState<string>("");
  const [budgetLabel, setBudgetLabel] = useState<string>("予算を選択");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      const areasData = await fetchAreas();
      setAreas(areasData);

      const shopsData = await fetchShops(searchParams.keyword, budget, selectedArea, privateRoom);
      setShops(shopsData);

      const lunchShopsData = await fetchLunchShops();
      setLunchShops(lunchShopsData);
    };

    fetchInitialData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams({
      keyword: searchParams.keyword || "",
      area: selectedArea,
      budget: budget,
      private_room: privateRoom ? "1" : "0",
    }).toString();

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
              setSelectedArea(selectedArea)
            }} name="area">
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
              }}
              name="budget"
            >
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
          <Genre shops={shops} />
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">注目度・アクセス数が多い</h2>
          <Genre shops={shops} />
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
];