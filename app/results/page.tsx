"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Shop } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function fetchShops(keyword?: string, budget?: string, area?: string, count?: string): Promise<Shop[]> {
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (budget) query.set("budget", budget);
    if (area) query.set("large_area", area);
    if (count) query.set("count", count);

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/shops?${query.toString()}`
        );
        if (!res.ok) {
            console.error(`Failed to fetch shops: ${res.status} ${res.statusText}`);
            return []; // エラー時も空の配列を返す
        }
        const data = await res.json();
        return data; // 明示的にデータを返す
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Fetch error:", errorMessage);
        return []; // エラー時も空の配列を返す
    }
}

export default function ResultsPage() {
    const searchParams = useSearchParams();
    const [shops, setShops] = useState<Shop[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const keyword = searchParams.get("keyword") || "";
        const budget = searchParams.get("budget") || "";
        const area = searchParams.get("area") || "";
        const count = searchParams.get("count") || "";

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const shopsData = await fetchShops(keyword, budget, area, count);
                setShops(shopsData);
            } catch (error) {
                console.error("Error fetching shops data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="result-card-container">
            {shops.length > 0 ? (
                shops.map((shop) => (
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
    );
}