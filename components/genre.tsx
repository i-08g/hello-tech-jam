"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Shop {
  id: string;
  name: string;
  address?: string;
  photo: {
    pc: {
      m: string;
    };
  };
  genre?: {
    name: string;
  };
}

interface GenreProps {
  shops: Shop[];
}

export const Genre: React.FC<GenreProps> = ({ shops }) => {
  return (
    <div className="card-container">
      {shops.length > 0 ? (
        shops.map((shop) => (
          <Card key={shop.id}>
            <CardHeader className="space-y-4 p-6">
              <Avatar className="w-12 h-12">
                <AvatarImage src={shop.photo.pc.m} alt={shop.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <CardTitle>{shop.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{shop.address || "住所情報なし"}</p>
              <p>{shop.genre?.name || "ジャンル情報なし"}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>店舗が見つかりません</p>
      )}
    </div>
  );
};

