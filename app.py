from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import configparser
import os
import random
from datetime import datetime
import requests
from io import BytesIO
from PIL import Image

import pandas as pd

app = Flask(__name__)

# 读取配置文件
config = configparser.ConfigParser()
config.read('config.ini')
GEMINI_API_KEY = config['Gemini']['API_KEY'] 

# 配置Gemini API
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-2.0-flash-001')


#RPG 語言模型

from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite", 
    google_api_key=config["Gemini"]["API_KEY"]
)

df = pd.read_csv(
        "https://www.taifex.com.tw/data_gov/taifex_open_data.asp?data_name=DailyForeignExchangeRates",
        encoding="cp950",
    )
df.isnull().sum()
df.drop(df.iloc[:, 5:], axis=1, inplace=True)
df.drop(df.iloc[:, 2:4], axis=1, inplace=True)
df.columns = ["date", "usd-twd", "usd-jpy"]
df["twd-jpy"] = df["usd-twd"] / df["usd-jpy"]
#df.drop(df.iloc[:, 1:3], axis=1, inplace=True)
df['date'] = pd.to_datetime(df['date'], format='%Y%m%d')
df['date'] = df["date"].astype(str)
print(df.head())
result = df.to_json(orient="records")






# 使用可靠的图片URL
travel_packages = [
    {
        "id": 1,
        "name": "日本京都文化深度遊",
        "price": 32800,
        "days": 5,
        "image": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRaXQc0w1yUUoOkzd4F1syjezyXB-c7qg_lR3rF6HoXwUcetf1nw_-oWOxLV1R3iPqHskMBFGRl7WVL76ov016cMFGSUYdIawn4GabXFA",
        "backup_images": [
            "https://picsum.photos/600/400?random=1&category=travel,japan",
            "https://source.unsplash.com/random/600x400/?japan,kyoto"
        ],
        "tour": [
            {
                "day": 1,
                "title": "抵達關西 & 清水寺周邊漫步",
                "activities": [
                    "抵達關西機場，前往京都並入住飯店",
                    "參拜清水寺，欣賞市區風景",
                    "逛二年坂、三年坂，品嚐抹茶甜點",
                    "夜訪祇園街區，晚餐享用湯豆腐或懷石料理"
                ],
                "image": "/static/images/清水寺.jpg"

            },
            {
                "day": 2,
                "title": "金閣寺 & 嵐山自然探索",
                "activities": [
                    "參觀金閣寺與龍安寺枯山水庭園",
                    "前往嵐山，走訪竹林小徑與渡月橋",
                    "晚餐於嵐山後返回市區休息"
                ],
                "image": "/static/images/渡月橋.jpg"
            },
            {
                "day": 3,
                "title": "南禪寺 & 哲學之道文青路線",
                "activities": [
                    "南禪寺、水路閣觀賞與拍照",
                    "沿哲學之道漫步至銀閣寺",
                    "傍晚至錦市場品嚐美食"
                ],
                "image": "/static/images/錦市場.jpg"
            },
            {
                "day": 4,
                "title": "宇治一日小旅行",
                "activities": [
                    "前往宇治，參觀平等院鳳凰堂",
                    "享受宇治抹茶點心，參觀抹茶館",
                    "河畔散步，晚上返回京都市區"
                ],
                "image": "/static/images/抹茶.jpg"
            },
            {
                "day": 5,
                "title": "自由活動 & 伴手禮採買",
                "activities": [
                    "上午自由活動（可體驗和服或茶道）",
                    "京都車站周邊購物",
                    "前往機場返回溫暖的家"
                ],
                "image": "/static/images/京都車站.jpg"
            }
        ]
    },
    {
        "id": 2,
        "name": "韓國全景文化體驗五日遊",
        "price": 20800,
        "days": 5,
        "image": "https://cw-image-resizer.cwg.tw/resize/uri/https%3A%2F%2Fcdn-www.cw.com.tw%2Farticle%2F202202%2Farticle-621493bd180fa.jpg/?w=1600&format=webp",
        "backup_images": [
            "https://images.unsplash.com/photo-1574879988115-0e3f4044d1e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80"
        ],
        "tour": [
            {
                "day": 1,
                "title": "抵達首爾 & 弘大夜生活",
                "activities": [
                    "抵達仁川機場，前往首爾飯店入住",
                    "漫步弘大商圈，感受年輕活力",
                    "晚餐享用韓式炸雞與啤酒"
                ],
                "image": "/static/images/弘大商圈.jpg"
            },
            {
                "day": 2,
                "title": "宮廷文化與韓屋美景",
                "activities": [
                    "參觀景福宮，體驗韓服並拍照留念",
                    "走訪北村韓屋村與三清洞咖啡街",
                    "晚餐品嚐傳統韓國宮廷料理"
                ],
                "image": "/static/images/北村韓屋村.jpg"
            },
            {
                "day": 3,
                "title": "韓流聖地與時尚購物",
                "activities": [
                    "前往狎鷗亭與江南逛街",
                    "參觀K-pop相關展館（如SM Town）",
                    "晚餐享用韓式烤肉"
                ],
                "image": "/static/images/江南.jpg"
            },
            {
                "day": 4,
                "title": "樂天世界 & 韓式放鬆體驗",
                "activities": [
                    "前往樂天世界主題樂園一日遊",
                    "傍晚回飯店附近體驗汗蒸幕",
                    "自由活動，可選擇附近夜市探索"
                ],
                "image": "/static/images/樂天世界.jpg"
            },
            {
                "day": 5,
                "title": "伴手禮採買 & 賦歸",
                "activities": [
                    "前往明洞、東大門或超市採購伴手禮",
                    "搭乘機場快線前往仁川機場",
                    "結束五日美好旅程"
                ],
                "image": "/static/images/東大門.jpg"
            }
        ]
    },
    {
        "id": 3,
        "name": "美國西岸經典之旅",
        "price": 111900,
        "days": 5,
       "image": "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTIhC44m2eNf0pSBvH_oe5vuBIoYmlFLNVR9YFhag4NrE73EBxEo7kCfr_9T2Wkhla315PswfqdVhitsiwaBH_wLUUSkcHyAYezMTv3IQ",
        "backup_images": [
            "https://picsum.photos/600/400?random=3&category=travel,usa",
            "https://source.unsplash.com/random/600x400/?california,beach"
        ],
        "tour": [
            {
                "day": 1,
                "title": "抵達洛杉磯 & 星光大道探索",
                "activities": [
                    "抵達洛杉磯國際機場，專車接送前往飯店",
                    "參觀好萊塢星光大道、杜比劇院與中國戲院",
                    "晚餐可選擇墨西哥風味或美式漢堡"
                ],
                "image": "/static/images/好萊塢.jpg"
            },
            {
                "day": 2,
                "title": "主題樂園歡樂日",
                "activities": [
                    "前往環球影城，體驗電影特效與遊樂設施",
                    "享用園區美食，探索哈利波特園區",
                    "傍晚返回飯店休息或自由活動"
                ],
                "image": "/static/images/環球影城.jpg"
            },
            {
                "day": 3,
                "title": "壯麗大峽谷之旅（選配）或聖塔莫尼卡海灘",
                "activities": [
                    "選擇搭機前往大峽谷參觀壯觀自然奇景（自費）",
                    "或留在洛杉磯前往聖塔莫尼卡海灘與碼頭散步",
                    "傍晚於比佛利山莊感受高端時尚氛圍"
                ],
                "image": "/static/images/大峽谷.jpg"
            },
            {
                "day": 4,
                "title": "前往舊金山，城市風光一日遊",
                "activities": [
                    "搭乘早班機或巴士前往舊金山",
                    "參觀金門大橋、漁人碼頭、九曲花街",
                    "搭乘叮噹車遊覽市區，晚餐享用螃蟹料理"
                ],
                "image": "/static/images/大橋.jpg"
            },
            {
                "day": 5,
                "title": "自由活動 & 返回家園",
                "activities": [
                    "上午自由活動，可前往聯合廣場購物",
                    "搭乘接駁前往舊金山機場",
                    "搭機返回溫暖的家"
                ],
                "image": "/static/images/聯合廣場.jpg"
            }
        ]
    },
    {
        "id": 4,
        "name": "歐洲四國探索之旅",
        "price": 164900,
        "days": 5,
        "image": "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQ8ASr6qh886c9Toa0dyIOvSIrlmu85MXKP3_xOVyibxl1wX8aQ_01xSzJD7RKHs-lx4ofyy7wwRi_NwauVgt-YRx_53MzVyQPCnW09aA",
        "backup_images": [
            "https://picsum.photos/600/400?random=4&category=travel,europe",
            "https://source.unsplash.com/random/600x400/?europe,castle"
        ],
        "tour": [
            {
                "day": 1,
                "title": "抵達巴黎 & 浪漫市區巡禮",
                "activities": [
                    "抵達巴黎戴高樂機場，專車接送前往飯店",
                    "參觀凱旋門、香榭麗舍大道",
                    "夜遊艾菲爾鐵塔與塞納河畔"
                ],
                "image": "/static/images/凱旋門.jpg"
            },
            {
                "day": 2,
                "title": "法國到瑞士 — 阿爾卑斯山魅力",
                "activities": [
                    "早餐後搭乘高鐵或巴士前往瑞士盧塞恩",
                    "參觀卡貝爾橋、獅子紀念碑，漫步湖畔",
                    "乘纜車登山，遠眺阿爾卑斯雪峰美景"
                ],
                "image": "/static/images/獅子.jpg"
            },
            {
                "day": 3,
                "title": "瑞士至德國 — 黑森林風光與古堡巡禮",
                "activities": [
                    "前往德國黑森林區，體驗咕咕鐘村莊",
                    "參觀新天鵝堡（外觀拍照）或附近古堡",
                    "於慕尼黑市區享用德式豬腳與啤酒"
                ],
                "image": "/static/images/新天鵝堡.jpeg"
            },
            {
                "day": 4,
                "title": "德國至義大利 — 水都威尼斯初體驗",
                "activities": [
                    "早上從慕尼黑出發，前往義大利威尼斯",
                    "搭乘貢多拉小船遊覽水巷風光",
                    "參觀聖馬可廣場、總督宮，享用義式披薩"
                ],
                "image": "/static/images/小船.jpg"
            },
            {
                "day": 5,
                "title": "米蘭市區 & 返回家園",
                "activities": [
                    "早上前往米蘭參觀米蘭大教堂與時尚購物街",
                    "自由採購精品或伴手禮",
                    "前往機場，搭機返回溫暖的家"
                ],
                "image": "/static/images/大教堂.jpg"
            }
        ]
    },
    {
        "id": 5,
        "name": "中國上海City Walk",
        "price": 22800,
        "days": 5,
       "image": "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRaNQbqfX0r6d5dJmfVijEhkJr8BHOumeq3ELRjTVsUImCvt9bVE7dYgXbUGXt7fLQHbzzd7G6NMv0fZ83HAWbQPln3Aobq7NHoOPom4Q",
        "backup_images": [
            "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1545912452-8aea7e25a3d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80"
        ],
        "tour": [
            {
                "day": 1,
                "title": "經典外灘與租界風華",
                "activities": [
                "抵達上海，入住市中心飯店（建議：人民廣場附近）",
                "外灘散步，觀賞浦東天際線與歷史建築群",
                "南京東路步行街夜遊，品嚐生煎包、小籠包"
                ],
                "image": "/static/images/東際線.jpg"
            },
            {
                "day": 2,
                "title": "法租界老洋房街區探索",
                "activities": [
                "徐匯衡山路、武康路散步，欣賞老洋房與梧桐街景",
                "打卡武康大樓、巴金故居、黑石公寓",
                "在安福路、五原路小店購物，咖啡館放鬆"
                ],
                "image": "/static/images/大樓.jpg"
            },
            {
                "day": 3,
                "title": "浦東摩登都市體驗",
                "activities": [
                "早上搭地鐵過黃浦江，前往陸家嘴金融區",
                "登上上海中心大廈觀景台或東方明珠",
                "逛正大廣場購物，晚上回到濱江大道看夜景"
                ],
                "image": "/static/images/夜景.jpg"
            },
            {
                "day": 4,
                "title": "文化藝文散步日",
                "activities": [
                "上午造訪上海博物館或建築藝術中心",
                "午後前往田子坊或新天地，探索文創小店與老弄堂",
                "晚上欣賞上海大劇院表演或散步在人民公園周邊"
                ],
                "image": "/static/images/博物館.jpg"
            },
            {
                "day": 5,
                "title": "巷弄裡的日常上海",
                "activities": [
                "早餐在本地人常去的路邊攤享用豆漿油條",
                "探索昌平路、愚園路或巨鹿路周邊的小巷與人文景點",
                "最後至靜安寺或久光百貨逛街，準備返程"
                ],
                "image": "/static/images/百貨.jpg"
            }
        ]
    },
    {
        "id": 6,
        "name": "紐西蘭南島自駕游",
        "price": 85800,
        "days": 5,
        "image": "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSJ7uhPqhZy72nnfgzm7OG-e76v_wk5_V20iEFP0M7NdouSkt_aJKwaY8jSNqhq7WPWJhnTJJ71pK32yc11XCZGLMuk_2aGsoiRQwqYRw",
        "backup_images": [
            "https://picsum.photos/600/400?random=6&category=travel,newzealand",
            "https://source.unsplash.com/random/600x400/?newzealand,mountain"
        ],
        "tour": [
            {
                "day": 1,
                "title": "基督城出發 · 進入湖區世界",
                "activities": [
                "抵達基督城，租車出發",
                "沿坎特伯里平原駕車前往蒂卡波湖（Lake Tekapo）",
                "傍晚參觀好牧羊人教堂，拍攝夢幻湖景",
                "晚上參加觀星導覽，體驗國際星空保護區的銀河星空"
                ],
                "image": "/static/images/湖.jpg"
            },
            {
                "day": 2,
                "title": "蒂卡波湖 → 庫克山國家公園",
                "activities": [
                "早餐後開車前往庫克山（Aoraki/Mount Cook）",
                "健行胡克谷步道（Hooker Valley Track）欣賞冰川湖與雪山",
                "參觀赫米蒂奇飯店的登山博物館",
                "夜宿庫克山區附近，體驗高山靜謐"
                ],
                "image": "/static/images/國家公園.jpg"
            },
            {
                "day": 3,
                "title": "壯麗南島 · 皇后鎮登場",
                "activities": [
                "前往皇后鎮（Queenstown），途中可經過 Lindis Pass 拍照留念",
                "抵達後搭乘纜車上鮑勃峰（Bob's Peak），俯瞰瓦卡蒂普湖",
                "晚上逛皇后鎮市區，品嚐知名 Fergburger 漢堡"
                ],
                "image": "/static/images/皇后鎮.jpg"
            },
            {
                "day": 4,
                "title": "米佛峽灣壯遊日",
                "activities": [
                "清晨出發前往米佛峽灣（Milford Sound），途經蒂阿瑙（Te Anau）",
                "參加峽灣遊船之旅，欣賞壯觀瀑布與峽谷地形",
                "可選擇搭乘觀景飛機返回皇后鎮（視天氣與預算）",
                "晚上自由活動或品味當地餐廳"
                ],
                "image": "/static/images/峽灣.jpg"
            },
            {
                "day": 5,
                "title": "返回基督城 · 沿途風景收尾",
                "activities": [
                "早餐後開車北返，途中可繞道瓦納卡（Wanaka）欣賞孤樹風景",
                "經阿瑟隘口（Arthur's Pass）回到基督城",
                "歸還租車，準備搭機返回或繼續下一段旅程"
                ],
                "image": "/static/images/孤樹.jpg"
            }
        ]
    }
]

# 模拟汇率数据
exchange_rates = {
    "USD": df['usd-twd'].iloc[-1],
    "JPY": df['usd-jpy'].iloc[-1],
}

# 模拟AI回复
ai_responses = [
    "根據當前匯率，100日圓 ≈ {JPY_RATE}台幣。推薦您考慮我們的「日本京都文化深度游」，現在預訂可享早鳥優惠！",
    "當前美元匯率：1美金 ≈ {USD_RATE}台幣。「美國西岸經典之旅」正在特價中，包含國家公園探索和城市觀光。",
    "我們建議您查看匯率分析頁面，掌握最佳換匯时時機，讓您的旅費發揮最大價值。",
]
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tours')
def tours():
    return render_template("tours.html", exchangeData=result)

@app.route('/exchange')
def exchange():
    
    return render_template("exchange.html", exchangeData=result)

@app.route('/ai')
def ai_assistant():
    return render_template('ai.html')

@app.route('/rpg')
def rpg():
    return render_template('rpg.html')

@app.route('/spin')
def spin():
    return render_template('spin.html')




@app.route('/api/packages')
def get_packages():
    return jsonify(travel_packages)

@app.route('/api/random-deal')
def random_deal():
    deals = [
        "日本東京五日游 - 兩人同行一人免費！",
        "韓國豪華別墅住宿 - 買三晚送一晚",
        "美國西岸之旅 - 早鳥優惠85折",
        "韓國首爾自由行 - 機票+酒店只要$8,888",
        "中國上海City Walk - 贈送購物金500人民幣",
        "歐洲四國遊 - 第二人半價"
    ]
    return jsonify({"deal": random.choice(deals)})

@app.route('/api/exchange-rates')
def get_exchange_rates():

    return jsonify({
        "USD": df['usd-twd'].iloc[-1],
        "JPY": df['usd-jpy'].iloc[-1],
        "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

chat_history = ""  # 這行寫在所有函式外面，模組最上方
@app.route('/api/ai-response', methods=['POST'])
def ai_response():
    global chat_history  # 加這行，讓函式能用到全局的chat_history
    
    data = request.json
    user_input = data.get('message', '')
    
    chat_history += f"用戶：{user_input}\n"
    
    # 你原本的prompt，記得把exchange_rates也定義好
    prompt = f"""
    你是一個專業的旅行社AI助手，幫助用戶規劃旅行行程並提供建議。
    當前匯率信息：
    - 美金(USD)：1 USD = {exchange_rates['USD']} TWD
    - 日圓(JPY)：100 JPY = {exchange_rates['JPY']*100} TWD

    以下是之前的對話紀錄：
    {chat_history}
    請用中文回覆，保持專業且友好的語氣，回覆長度控制在200字以内。
    """

    try:
        response = model.generate_content(prompt)
        ai_reply = response.text.strip()
    except Exception as e:
        print(f"Gemini API錯誤: {e}")
        ai_reply = "抱歉，服務暫時不可用，請稍後再試。"

    chat_history += f"AI：{ai_reply}\n"
    
    return jsonify({"response": ai_reply})



@app.route("/call_llm", methods=["POST"])
def call_llm():
    if request.method == "POST":
        print("POST!")  # 可以檢查是否有收到請求
        
        # 從前端獲取參數
        user_input = request.form.get('user_input', '預設訊息')  # 如果沒有提供user_input，使用預設訊息
        print(f"接收到的訊息: {user_input}")
        
        # 根據不同情境設置 role_description
        if user_input == "日本":  # case 2: 日本
            role_description = """
            你是台灣人，請用繁體中文回答，介紹日本(100字以內)。
            """
        elif user_input == "美國":  # case 3: 美國
            role_description = """
            你是台灣人，請用繁體中文回答，介紹美國(100字以內)。
            """
        elif user_input == "歐洲":  # case 4: 歐洲  
            role_description = """
            你是台灣人，請用繁體中文回答，介紹歐洲(100字以內)。
            """
        elif user_input == "上海":  # case 5: 
            role_description = """
            你是台灣人，請用繁體中文回答，介紹上海(100字以內)。
            """
        elif user_input == "韓國":  # case 6: 韓國
            role_description = """
            你是台灣人，請用繁體中文回答，介紹韓國(100字以內)。
            """
        elif user_input == "紐西蘭":  # case 7: 紐西蘭
            role_description = """
            你是台灣人，請用繁體中文回答，介紹紐西蘭(100字以內)。
            """
     
        # 構造消息
        messages = [
            ("system", role_description),
            ("human", user_input),
        ]
        
        try:
            # 呼叫 LLM，並將訊息傳送給它
            result = llm.invoke(messages)
            return result.content  # 返回 LLM 生成的回應
        except Exception as e:
            print(f"錯誤: {e}")
            return "我現在不想跟你講話，待會再來"

@app.route('/package-detail.html')
def package_detail():
    package_id = request.args.get('id')
    package = next((pkg for pkg in travel_packages if str(pkg["id"]) == package_id), None)
    if not package:
        return "找不到對應行程", 404
    return render_template('package-detail.html', package=package)

@app.route('/loading')
def loading_page():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>預訂處理中</title>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: 'Noto Sans TC', sans-serif;
                text-align: center;
                padding: 50px;
                background-color: #f7fff7;
            }
            img {
                max-width: 500px;
                border-radius: 15px;
                margin-bottom: 20px;
            }
            h1 {
                color: #ff6b6b;
                margin-bottom: 10px;
            }
            p {
                font-size: 1.2rem;
                color: #292f36;
            }
        </style>
    </head>
    <body>
        <img src="https://img.freepik.com/premium-photo/black-white-illustration-cute-bear-using-laptop-with-coffee-cup-beside-it-white-background-concept-animal-working-technology-coffee-break-funny-bear-coloring-page_981050-27346.jpg" 
             alt="熊熊努力工作中">
        <h1>熊熊努力搶救中...</h1>
        <p>請稍候，我們正在為您處理預訂</p>
        
        <script>
            // 3秒後跳轉回原頁面
            setTimeout(function() {
                window.close();
            }, 3000);
        </script>
    </body>
    </html>
    """
if __name__ == '__main__':
    app.run(debug=True, port=5001)