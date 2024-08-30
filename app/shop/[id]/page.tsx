import { GetServerSideProps } from 'next';
import { Shop } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ShopDetailProps {
    shop: Shop | null;
}

export default function ShopDetail({ shop }: ShopDetailProps) {
    if (!shop) {
        return <p>店舗情報が見つかりません</p>;
    }

    return (
        <div className="shop-detail-container">
            <Card>
                <CardHeader className="space-y-4 p-6">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={shop.photo.pc.m} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <CardTitle>{shop.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{shop.genre?.name || "ジャンル情報なし"} | {shop.area?.name || "エリア情報なし"}</p>
                    <div>
                        <strong>個室の有無:</strong> {shop.private_room === "1" ? "あり" : "なし"}
                    </div>
                    <div>
                        <strong>駐車場の有無:</strong> {shop.parking === "あり" ? "あり" : "なし"}
                    </div>
                    <div>
                        <strong>価格帯:</strong> {shop.budget?.name || "情報なし"}
                    </div>
                    <div>
                        <strong>営業時間:</strong> {shop.open || "情報なし"}
                    </div>
                    <div>
                        <strong>定休日:</strong> {shop.close || "情報なし"}
                    </div>
                    <div>
                        <strong>住所:</strong> {shop.address || "情報なし"}
                    </div>
                    <div>
                        <strong>アクセス:</strong> {shop.access || "情報なし"}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    const res = await fetch(`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=YOUR_API_KEY&id=${id}&format=json`);
    const data = await res.json();

    if (!data.results.shop || data.results.shop.length === 0) {
        return {
            props: {
                shop: null,
            },
        };
    }

    return {
        props: {
            shop: data.results.shop[0],
        },
    };
};
