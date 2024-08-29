"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const shop = searchParams.get("shop");

  const parsedShop = shop ? JSON.parse(shop) : null;

  return (
    <div className="container mx-auto p-4">
      {parsedShop ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* 画像をセンターに配置し、サイズを大きくする */}
          <img 
            src={parsedShop.logo_image} 
            alt={parsedShop.name} 
            className="mx-auto mt-6 rounded-lg w-64 h-64 object-cover" 
          />
          <h1 className="text-3xl font-bold text-center mt-4">{parsedShop.name}</h1>
          <p className="text-gray-600 text-center">{parsedShop.address || "住所情報なし"}</p>
          <p className="text-gray-600 text-center">{parsedShop.genre?.name || "ジャンル情報なし"}</p>
          <p className="text-gray-600 text-center">予算: {parsedShop.budget?.name || "情報なし"}</p>
          <p className="text-gray-600 text-center">収容人数: {parsedShop.capacity}人</p>
          <p className="text-gray-600 text-center">カード: {parsedShop.card}</p>
          <p className="text-gray-600 text-center">営業時間: {parsedShop.open}</p>
          <p className="text-gray-600 text-center">定休日: {parsedShop.close}</p>
          <div className="mt-4 text-center">
            <a href={parsedShop.urls.pc} className="text-blue-500 hover:underline">詳細・予約はこちら</a>
          </div>
        </div>
      ) : (
        <p>店舗情報がありません</p>
      )}
    </div>
  );
};

export default SearchPage;