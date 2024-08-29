"use client";

import { Shop } from "@/types";
import { Input } from "@/components/ui/input";
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
import { log } from "console";
import {Genre} from "../components/genre"

interface ServiceArea {
  code: string;
  name: string;
}

async function fetchShops(keyword?: string, budget?: string): Promise<Shop[]> {
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (budget) query.set("budget", budget);

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
    const res = await fetch("/api/areas"); // 正しいAPIエンドポイントを設定
    if (!res.ok) {
      throw new Error("Failed to fetch areas");
    }
    const data = await res.json();
    return data; // APIが返す形式に合わせて修正
  } catch (error) {
    console.error("Error fetching areas:", error);
    return [];
  }
}

const budgetOptions = [
  { value: "B001", label: "〜1000円" },
  { value: "B002", label: "1001〜2000円" },
  { value: "B003", label: "2001〜3000円" },
  { value: "B004", label: "3001〜4000円" },
  { value: "B005", label: "4001〜5000円" },
  // ... 他の予算オプションを追加
];

export default function GourmetsPage({
  searchParams,
}: {
  searchParams: { keyword?: string };
}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [area, setArea] = useState("沖縄");
  const [budget, setBudget] = useState<string>("");

  useEffect(() => {
    // Fetch shops on mount
    const fetchInitialShops = async () => {
      const shopsData = await fetchShops(searchParams.keyword);
      setShops(shopsData);
    };

    // Fetch service areas on mount
    const fetchServiceAreas = async () => {
      const areasData = await fetchAreas();
      setAreas(areasData);
    };

    fetchInitialShops();
    fetchServiceAreas();
  }, [searchParams.keyword]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-36 px-8 md:px-12 lg:px-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <form className="search-bar">
        {/* Dynamic Area Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{area}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>エリアを選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup onValueChange={(selectedArea) => {
              setArea(selectedArea)
            }} name="area">
              <DropdownMenuRadioItem value="okinawa">沖縄</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="kagoshima">鹿児島</DropdownMenuRadioItem>
              {/* 他のジャンルを追加 */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* 予算のプルダウンメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{budget ? budget : "予算を選択"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>予算を選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              onValueChange={(selectedBudget) => {
                setBudget(selectedBudget);  // 予算をステートに保存
              }}
              name="budget"
            >
              <DropdownMenuRadioItem value="B001">~500円</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="B002">501~1000円</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="B003">1001~2000円</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="B004">2001~3000円</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="B005">3001~4000円</DropdownMenuRadioItem>
              {/* 他の予算オプションを追加 */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Static Genre Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">店名・ジャンル</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>店名・ジャンルを選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup name="genre">
              <DropdownMenuRadioItem value="sushi">寿司</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ramen">ラーメン</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="yakiniku">焼肉</DropdownMenuRadioItem>
              {/* 他のジャンルを追加 */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Static Date Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">日付</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>日付を選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup name="date">
              <DropdownMenuRadioItem value="2024-08-29">
                2024年8月29日
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2024-08-30">
                2024年8月30日
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2024-09-01">
                2024年9月1日
              </DropdownMenuRadioItem>
              {/* 他の日付を追加 */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="submit">検索</Button>
      </form>
      <div className="space-y-8 py-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">近くのお店</h2>
          <Genre shops={shops} />
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">ランチに最適2000円以下</h2>
          <Genre shops={shops} />
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">ディナーに最適4000円以下</h2>
          <Genre shops={shops} />
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">注目度・アクセス数が多い</h2>
          <Genre shops={shops} />
        </section>
        
        {/* ランキング上位のおすすめ店表示 */}
      </div>
    </div>
  );
}