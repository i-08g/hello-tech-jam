import React, { useEffect, useState } from "react";
import axios from "axios";

function ShopList() {
  const [shopData, setShopData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchShopLists() {
      const areaCode = ""; // 適切な値を設定
      const stationPre = "";
      const stationPos = "";
      const genreCode = "";
      const keyword = "";

      try {
        const res = await axios.get("/api/getShopLists", {
          params: {
            startNum: currentPage,
            areaCode,
            stationPre,
            stationPos,
            genreCode,
            keyword,
          },
        });
        setShopData(res.data);
      } catch (error) {
        console.error("Error fetching shop lists:", error);
      }
    }

    fetchShopLists();
  }, [currentPage]); // currentPageが変更されたときにエフェクトを再実行

  if (!shopData) return <div>Loading...</div>;

  return (
    <div>
      {/* shopDataを使用してコンポーネントをレンダリング */}
      <button onClick={() => setCurrentPage(prev => prev + 1)}>Next Page</button>
    </div>
  );
}

export default ShopList;