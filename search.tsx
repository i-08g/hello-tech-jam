const res = await axios.get("/api/getShopLists", {
    params: {
        startNum: currentPage,  //ページネーション用
        areaCode, //エリア用
        stationPre, //駅名
        stationPos, //駅座標
        genreCode, //ジャンル用
        keyword, //キーワード
    },
});