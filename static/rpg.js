let mapArray, ctx, currentImgMain;
const gridLength = 100;
let images = {}; // 定義全域變數來存放圖片物件

// 初始化
$(function () {
    // 地圖陣列：2 : 日本   3 : 美國   4 : 歐洲  5 : 上海   6 :韓國 7 : 紐西蘭
        
    mapArray = [
        [0, 0, 0, 0, 0, 0, 5, 0],
        [0, 0, 7, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 0],
        [3, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 6, 0, 0, 0, 4, 0, 0]
    ];
    ctx = $("#myCanvas")[0].getContext("2d");

    // 載入多張圖片的函式
    function loadImages(sources, callback) {
        let images = {};
        let loadedImages = 0;
        let numImages = 0;

        // get num of sources
        for(var src in sources) {
            numImages++;
        }
        for(var src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if(++loadedImages >= numImages) {
                    callback(images);
                }   
            };
            images[src].src = sources[src];
        }
    }     
    // 圖片來源
    const sources = {
        main: "/static/images/bear.png",
        material: "/static/images/material.png",
        country : "/static/images/country.png"
    };








    // 載入圖片並繪製地圖
    loadImages(sources, function (loadedImages) {
        images = loadedImages; // 將載入的圖片存入全域變數
        currentImgMain = { x: 0, y: 0 };

        // 繪製主角
        ctx.drawImage(images.main, 5, 130, 70, 60, currentImgMain.x, currentImgMain.y, gridLength, gridLength);

        // 繪製地圖
        for (let row = 0; row < mapArray.length; row++) {
            for (let col = 0; col < mapArray[row].length; col++) {
                const tile = mapArray[row][col];
                const xPos = col * gridLength;
                const yPos = row * gridLength;

                if (tile === 1) {
                    ctx.drawImage(images.material, 32, 65, 32, 32, xPos, yPos, gridLength, gridLength);
                }  else if (tile === 2) {
                    ctx.drawImage(images.country, 563, 330, 132, 148, xPos, yPos, gridLength, gridLength);
                }   else if (tile === 3) {
                    ctx.drawImage(images.country, 20, 22, 132, 148, xPos, yPos, gridLength, gridLength);
                }
                else if (tile === 4) {
                    ctx.drawImage(images.country, 20, 175, 132, 148, xPos, yPos, gridLength, gridLength);
                } else if (tile === 5) {
                    ctx.drawImage(images.country, 153, 22, 132, 148, xPos, yPos, gridLength, gridLength);
                } else if (tile === 6) {
                    ctx.drawImage(images.country, 289, 175, 132, 148, xPos, yPos, gridLength, gridLength);
                } else if (tile === 7) {
                    ctx.drawImage(images.country, 426, 328, 132, 148, xPos, yPos, gridLength, gridLength);
                }
            
                

            }
        }
    });
});


// 鍵盤事件處理
$(document).on("keydown", function (event) {
    console.log(event.code);
    let targetImg, targetBlock, cutImagePositionY;
    targetImg = { x: -1, y: -1 };
    targetBlock = { x: -1, y: -1 };
    event.preventDefault();

    switch (event.code) {
        case "ArrowLeft":
            targetImg.x = currentImgMain.x - gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionY = 200; // 主角面向左
            break;
        case "ArrowUp":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y - gridLength;
            cutImagePositionY = 0; // 主角面向上
            break;
        case "ArrowRight":
            targetImg.x = currentImgMain.x + gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionY = 70; // 主角面向右
            break;
        case "ArrowDown":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y + gridLength;
            cutImagePositionY = 130; // 主角面向下
            break;
        default:
            return;
    }

    // 確認目標位置不超出邊界
    if (targetImg.x <= 700 && targetImg.x >= 0 && targetImg.y <= 500 && targetImg.y >= 0) {
        targetBlock.x = targetImg.y / gridLength;
        targetBlock.y = targetImg.x / gridLength;
    } else {
        targetBlock.x = -1;
        targetBlock.y = -1;
    }

    // 清除主角原本位置
    ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLength, gridLength);

    // 檢查目標位置並更新主角位置
    if (targetBlock.x != -1 && targetBlock.y != -1) {
        switch (mapArray[targetBlock.x][targetBlock.y]) {
            case 0: // 可走
                $("#talkBox").text("");
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 2: // 日本
                $("#talkBox").text("機器人思考中...");
                const userInputForJapan = "日本";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForJapan }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;
            case 3: // 美國
                $("#talkBox").text("機器人思考中...");
                const userInputForUSA = "美國";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForUSA }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;
            case 4: // 歐洲
                $("#talkBox").text("機器人思考中...");
                const userInputForEurope = "歐洲";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForEurope }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;
            case 5: // 上海
                $("#talkBox").text("機器人思考中...");
                const userInputForShanghai = "上海";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForShanghai }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;
            case 6: // 韓國
                $("#talkBox").text("機器人思考中...");
                const userInputForKorea = "韓國";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForKorea }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;
            case 7: // 紐西蘭
                $("#talkBox").text("機器人思考中...");
                const userInputForNewZealand = "紐西蘭";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForNewZealand }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;
            
            
        }
    } else {
        $("#talkBox").text("邊界");
    }

    // 繪製主角新位置
    ctx.drawImage(images.main, 5, cutImagePositionY, 70, 55, currentImgMain.x, currentImgMain.y, gridLength, gridLength);
});


