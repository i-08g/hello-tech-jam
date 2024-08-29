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

interface ServiceArea {
  code: string;
  name: string;
}

async function fetchShops(keyword?: string, budget?: string, area?: string, privateRoom?: boolean): Promise<Shop[]> {
  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (budget) query.set("budget", budget);
  if (area) query.set("large_area", area);
  if (privateRoom) query.set("private_room", "1"); // 個室ありをリクエストするために "1" を設定

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

export default function GourmetsPage({
  searchParams,
}: {
  searchParams: { keyword?: string };
}) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("Z098"); // 初期エリア設定（例：東京）
  const [budget, setBudget] = useState<string>("");
  const [budgetLabel, setBudgetLabel] = useState<string>("予算を選択");
  const [privateRoom, setPrivateRoom] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true); // 初期ロード状態のフラグ

  const router = useRouter(); // useRouterフックを使用

  useEffect(() => {
    // 初回マウント時にエリアのデータと初期の店舗データを取得
    const fetchServiceAreas = async () => {
      const areasData = await fetchAreas();
      setAreas(areasData);
    };

    const fetchInitialShops = async () => {
      const shopsData = await fetchShops(searchParams.keyword, budget, selectedArea, privateRoom);
      setShops(shopsData);
      setInitialLoad(false); // 初期ロード完了
    };

    fetchServiceAreas();
    fetchInitialShops();
  }, []); // 依存配列は空で初回のみ実行

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const shopsData = await fetchShops(searchParams.keyword, budget, selectedArea, privateRoom);
    setShops(shopsData); // 検索ボタンが押された後に結果を更新

    const query = new URLSearchParams({
      keyword: searchParams.keyword || "",
      area: selectedArea,
      budget: budget,
      private_room: privateRoom ? "1" : "", // チェックがついている場合に "1" をセット
    }).toString();

    // 結果ページにリダイレクト
    router.push(`/results?${query}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-36 px-8 md:px-12 lg:px-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        {/* Dynamic Area Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{selectedArea}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>エリアを選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup onValueChange={(selectedArea) => {
              setSelectedArea(selectedArea);
            }} name="area">
              <DropdownMenuRadioItem value="Z098">沖縄</DropdownMenuRadioItem>
              {/* 他のエリアオプションを追加 */}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 予算のプルダウンメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{budgetLabel}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>予算を選択</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              onValueChange={(selectedBudget) => {
                setBudget(selectedBudget);  // 予算コードをステートに保存
                const selectedLabel = budgetOptions.find(
                  (option) => option.value === selectedBudget
                )?.label;
                if (selectedLabel) setBudgetLabel(selectedLabel);  // ラベルをステートに保存
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

        {/* 個室のチェックボックス */}
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

      <div className="card-container">
        {shops.length > 0 ? (
          shops
            .filter(shop => !privateRoom || shop.private_room === "1")  // 個室ありのみをフィルタリング
            .map((shop) => (
              <Card key={shop.id}>
                <CardHeader className="space-y-4 p-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={shop.photo.pc.m} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <CardTitle>{shop.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{shop.address || "住所情報なし"}</p>
                  <p>{shop.genre?.name || "ジャンル情報なし"}</p>
                  <p>{shop.budget?.name || "予算情報なし"}</p>
                  <p>{shop.private_room === "1" ? "個室あり" : "個室なし"}</p>
                </CardContent>
              </Card>
            ))
        ) : (
          <p>店舗が見つかりません</p>
        )}
      </div>
      )}
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
  // 他の予算オプ
]