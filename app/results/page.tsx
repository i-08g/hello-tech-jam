"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Shop } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function fetchShops(keyword?: string, budget?: string, area?: string): Promise<Shop[]> {
    const query = new URLSearchParams();
    if (keyword) query.set("keyword", keyword);
    if (budget) query.set("budget", budget);
    if (area) query.set("large_area", area);

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

export default function ResultsPage() {
    const searchParams = useSearchParams();
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        const keyword = searchParams.get("keyword") || "";
        const budget = searchParams.get("budget") || "";
        const area = searchParams.get("area") || "";

        const fetchData = async () => {
            try {
                const shopsData = await fetchShops(keyword, budget, area);
                setShops(shopsData);
            } catch (error) {
                console.error("Error fetching shops data:", error);
            }
        };

        fetchData();
    }, [searchParams]);


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


                            {console.log(`"${shop.private_room}"`)} // 値の前後にスペースや余計な文字がないか確認


                            <p>{shop.address || "住所情報なし"}</p>
                            <p>{shop.genre?.name || "ジャンル情報なし"}</p>
                            <p>{shop.budget?.name || "予算情報なし"}</p>
                            <p>{shop.private_room.trim() === "あり" ? "個室あり" : "個室なし"}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p>店舗が見つかりません</p>
            )}
        </div>
    );
}
