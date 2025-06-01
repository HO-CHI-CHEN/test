
let mapArray, ctx, currentImgMain;
const gridLength = 100;
let images = {}; // 定義全域變數來存放圖片物件

// 初始化
$(function () {
    // 地圖陣列：0-可走、1-山、2-終點、3-敵人
    mapArray = [
        [0, 0, 1, 0, 0, 0, 1, 4],
        [1, 0, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1],
        [3, 0, 1, 1, 1, 1, 0, 2]
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
        main: "/static/images/spriteSheet.png",
        material: "/static/images/material.png",
        enemy: "/static/images/Enemy.png",
    };








    // 載入圖片並繪製地圖
    loadImages(sources, function (loadedImages) {
        images = loadedImages; // 將載入的圖片存入全域變數
        currentImgMain = { x: 0, y: 0 };

        // 繪製主角
        ctx.drawImage(images.main, 0, 0, 80, 130, currentImgMain.x, currentImgMain.y, gridLength, gridLength);

        // 繪製地圖
        for (let row = 0; row < mapArray.length; row++) {
            for (let col = 0; col < mapArray[row].length; col++) {
                const tile = mapArray[row][col];
                const xPos = col * gridLength;
                const yPos = row * gridLength;

                if (tile === 1) {
                    ctx.drawImage(images.material, 32, 65, 32, 32, xPos, yPos, gridLength, gridLength);
                } else if (tile === 3) {
                    ctx.drawImage(images.enemy, 7, 40, 104, 135, xPos, yPos, gridLength, gridLength);
                } else if (tile === 4) {
                    ctx.drawImage(images.material, 65, 65, 32, 32, xPos, yPos, gridLength, gridLength);
                }
            }
        }
    });
});


// 鍵盤事件處理
$(document).on("keydown", function (event) {
    console.log(event.code);
    let targetImg, targetBlock, cutImagePositionX;
    targetImg = { x: -1, y: -1 };
    targetBlock = { x: -1, y: -1 };
    event.preventDefault();

    switch (event.code) {
        case "ArrowLeft":
            targetImg.x = currentImgMain.x - gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 175; // 主角面向左
            break;
        case "ArrowUp":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y - gridLength;
            cutImagePositionX = 355; // 主角面向上
            break;
        case "ArrowRight":
            targetImg.x = currentImgMain.x + gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 540; // 主角面向右
            break;
        case "ArrowDown":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y + gridLength;
            cutImagePositionX = 0; // 主角面向下
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
            case 1: // 山
                $("#talkBox").text("有山");
                break;
            case 2: // 終點
                $("#talkBox").text("...");
                // 自定義訊息，傳遞給後端
                const userInputForLLM = "恭喜我到達終點，請給我一些鼓勵的話！";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForLLM }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 3: // 敵人
                $("#talkBox").text("機器人思考中...");
                const userInputForEnemy = "我遇到敵人了，請給我一些提示！";

                // 向後端發送包含自定義訊息的請求
                $.post('/call_llm', { user_input: userInputForEnemy }).done(function(data) {
                    console.log("LLM 回應:", data);
                    $("#talkBox").text(data);  // 顯示回應在 talkBox 中
                }).fail(function(error) {
                    console.error("錯誤:", error);
                    $("#talkBox").text("無法與語言模型連接。");
                });
                break;

            case 4: // 番茄
                $("#talkBox").text("你吃掉了番茄！");
                // 把該格變成 0（地板）
                mapArray[targetBlock.x][targetBlock.y] = 0;
        
                // 清掉原本的番茄圖片
                ctx.clearRect(targetImg.x, targetImg.y, gridLength, gridLength);
        
                // 更新主角位置
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
        }
    } else {
        $("#talkBox").text("邊界");
    }

    // 繪製主角新位置
    ctx.drawImage(images.main, cutImagePositionX, 0, 80, 130, currentImgMain.x, currentImgMain.y, gridLength, gridLength);

    
});

