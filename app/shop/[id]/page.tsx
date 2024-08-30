// app/shop/[id]/page.tsx
import React from "react";

// この関数はサーバー側で実行され、データを取得します。
async function fetchShopData(id: string) {
    const res = await fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=YOUR_API_KEY&id=${id}&format=json`);
    if (!res.ok) {
        throw new Error(`Failed to fetch shop data: ${res.statusText}`);
    }
    const data = await res.json();

    // 取得したデータを確認
    console.log(data);

    // APIのレスポンスデータ構造が期待通りでない場合の処理
    if (!data || !data.results || !data.results.shop || data.results.shop.length === 0) {
        return null;
    }

    return data.results.shop[0];
}

export default async function ShopDetailPage({ params }: { params: { id: string } }) {
    const shop = await fetchShopData(params.id);

    // データが取得できなかった場合のフォールバック表示
    if (!shop) {
        return (
            <div>
                <h1>ショップ名がありません</h1>
                <p>住所がありません</p>
                <p>ジャンルがありません</p>
                <p>予算がありません</p>
            </div>
        );
    }

    return (
        <div>
            <h1>{shop.name || "ショップ名がありません"}</h1>
            <p>{shop.address || "住所がありません"}</p>
            <p>{shop.genre?.name || "ジャンルがありません"}</p>
            <p>{shop.budget?.name || "予算がありません"}</p>
        </div>
    );
}
