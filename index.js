// Import required libraries
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

// Environment variables and constants
const API_KEY =
    process.env.API_KEY || "7806217113:AAFlIuLrnq3g74zNNEOeSBC3NnJLufl4R-I";
const bot = new TelegramBot(API_KEY, { polling: true });

const REGISTER_API = "https://p-api.sbc369.club/api/cash/registration/";
const LOGIN_API = "https://p-api.sbc369.club/api/cash/login/";
const CAPTION =
    "សំរាប់ចម្ងល់ឬបញ្ហាផ្សេងៗ នឹង ដាក់/ដក ប្រាក់ ចុចទីនេះ 👉🏻 @KC999_CS  បញ្ជាក់៖ នេះជាម៉ាសុីនសម្រាប់តែបង្កើតអាខោន មិនចេះឆ្លើយតបទេ។ សូមអរគុណ!";
const CERT = "3Wum85V6T95x9CD6trrXiS";
const IMAGE_URL = "https://i.ibb.co/5cKKK9W/i5Ra3MQ.jpg";
const Authorization = "Token e3543a091350bec511dbe18c6acfcbe4ed4a4b97";
// Function to get public IP
function generateNineDigitNumber() {
    return Math.floor(100000000 + Math.random() * 900000000);
}

function handleContactCommand(chatId) {
    bot.sendPhoto(chatId, IMAGE_URL, { caption: CAPTION });
}
function handleLogin(chatId, FullName, Password, data_l, headers) {
    axios.post(LOGIN_API, data_l, { headers })
        .then((responseLogin) => {
            if (responseLogin.status === 200) {
                bot.sendMessage(chatId, `អ្នកមាន អាខោន រួចហើយ!`);

                const { sessionid, userid } = responseLogin.data;
                bot.sendMessage(
                    chatId,
                    `Your account: \`${FullName}\`\nYour password: \`${Password}\``,
                    { parse_mode: "Markdown" },
                );
                const rehref = `http://player.kh88.me/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
                bot.sendMessage(chatId, `Login:\n${rehref}`);
                handleContactCommand(chatId);
            } else {
                console.log("Unexpected response:", responseLogin.data);
            }
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.message;
            if (errorMessage === "Username or password is not valid!") {
                bot.sendMessage(
                    chatId,
                    `ឈ្មោះរបស់អ្នកមានរួចហេីយសូមធ្វេីការដូរឈ្មោះតេឡេក្រាមលោកអ្នក!`,
                );
            }
        });
}

// Handle /register and /start commands
bot.onText(/\/(register|start)/, async (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";
    const lastName = msg.from.last_name || "";
    const UserName = msg.from.username || "";
    const FullName = `${firstName}${lastName}`.trim();
    const Password = msg.from.id;
    const Phone = generateNineDigitNumber();
    let data_l = {
        username: FullName,
        password: Password,
        cert: CERT,
    };
    let data_r = {
        account: FullName,
        name: UserName,
        password: Password,
        contact: Phone,
        affiliate: "",
        cert: CERT,
    };
    const headers = {
        "Content-Type": "application/json",
        Authorization: Authorization,
    };
    try {
        const response = await axios.post(REGISTER_API, data_r, { headers });
        if (response.status === 201) {
            const responseLogin = await axios.post(LOGIN_API, data_l, {
                headers,
            });
            if (responseLogin.status === 200) {
                bot.sendMessage(chatId, `អ្នកបង្កើត អាខោន ជោគជ័យ!`);
                const {domain, sessionid, userid } = responseLogin.data;
                bot.sendMessage(
                    chatId,
                    `Your account: \`${FullName}\`\nYour password: \`${Password}\``,
                    { parse_mode: "Markdown" },
                );
                const rehref = `${domain}/?sid=${sessionid}&uid=${userid}&cert=${CERT}&language=EN`;
                bot.sendMessage(chatId, `Login:\n${rehref}`);
                handleContactCommand(chatId);
            }
        }
    } catch (error) {
        // Handle specific error messages
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message;
            switch (errorMessage) {
                case "The account is already exists!":
                    handleLogin(
                        chatId,
                        FullName,
                        Password,
                        data_l,
                        headers,
                    );
                    break;
                case "The phone number is already exists!":
                    bot.sendMessage(chatId, `លេខទូរស័ព្ទមានហើយ!`);
                    break;
                case "Minimum username 6 digits and maxiumm 10 digits!":
                    bot.sendMessage(
                        chatId,
                        `ឈ្មោះអ្នកប្រើអប្បបរមា 6 ខ្ទង់ និងអតិបរមា 10 ខ្ទង់!`,
                    );
                    break;
                case "Username contains space!":
                    bot.sendMessage(
                        chatId,
                        `ឈ្មោះអ្នកប្រើប្រាស់មានកន្លែងទំនេរ!`,
                    );
                    break;
                case "Username or password is not valid!":
                    bot.sendMessage(
                        chatId,
                        `ឈ្មោះរបស់អ្នកមានរួចហេីយសូមធ្វេីការដូរឈ្មោះតេឡេក្រាមលោកអ្នក!`,
                    );
                    break;
                default:
                    bot.sendMessage(
                        chatId,
                        `Unexpected error: ${errorMessage}`,
                    );
                    break;
            }
        } else {
            bot.sendMessage(
                chatId,
                `Bot is temporarily down. Please try again later.`,
            );
        }
    }
});

// Handle /contact command
bot.onText(/\/contact/, (msg) => {
    const chatId = msg.chat.id;
    handleContactCommand(chatId);
});

const express = require("express");
const { log } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
);