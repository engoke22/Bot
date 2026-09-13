

const BOT_START_TIME = Date.now();

const OWNER = "Unique Engoke Lesley";
const VERSION = "v1.0.0";

export default {
  async fetch(request, env) {

    // Check that the Worker is online
    if (request.method === "GET") {
      return new Response(
        "AVIATOR PREDICTIOR BOT IS ONLINE",
        {
          status: 200
        }
      );
    }

    if (request.method !== "POST") {
      return new Response(
        "Method Not Allowed",
        {
          status: 405
        }
      );
    }

    try {

      const update = await request.json();

      // Ignore unsupported updates
      if (!update.message) {
        return new Response(
          "OK",
          {
            status: 200
          }
        );
      }

      const chatId = update.message.chat.id;

      const firstName =
        update.message.from?.first_name ||
        "User";

      const text =
        (update.message.text || "").trim();

      let replyText;

      // START / HOME

      if (
        text === "/start" ||
        text === "🏠 HOME"
      ) {

        replyText = getMainMenu(firstName);

      }


      // PREDICTION

      else if (
        text === "✈️ GET PREDICTION"
      ) {

        const prediction =
          generateFunPrediction();

        replyText =
          "✈️ AVIATOR FUN SIMULATOR\n\n" +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "🎯 SIMULATED MULTIPLIER\n\n" +
          `🚀 ${prediction.multiplier}x\n\n` +
          `📊 Confidence: ${prediction.confidence}%\n` +
          `⚡ Signal: ${prediction.signal}\n\n` +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "⚠️ FOR ENTERTAINMENT ONLY\n\n" +
          "This result is randomly generated and " +
          "does not predict or guarantee the outcome " +
          "of any real Aviator game.";

      }


      // MULTIPLE SIGNALS

      else if (
        text === "📡 SIGNALS"
      ) {

        const signals =
          generateSignals();

        replyText =
          "📡 AVIATOR FUN SIGNALS\n\n" +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          signals +
          "\n\n━━━━━━━━━━━━━━━━━━\n\n" +
          "⚠️ Entertainment simulation only.\n" +
          "These are random generated values and are " +
          "not real predictions.";

      }


      // BOT STATUS

      else if (
        text === "📊 BOT STATUS"
      ) {

        const uptime =
          getUptime();

        const date =
          getKenyaDate();

        replyText =
          "📊 BOT STATUS\n\n" +
          `🟢 Status: ONLINE\n` +
          `⚙️ Version: ${VERSION}\n` +
          `👑 Owner: ${OWNER}\n` +
          `⏱ Runtime: ${uptime}\n` +
          `📅 Date: ${date}\n\n` +
          "Cloudflare Worker is running successfully.";

      }


      // ABOUT

      else if (
        text === "ℹ️ ABOUT"
      ) {

        replyText =
          "ℹ️ AVIATOR PREDICTIOR\n\n" +
          "This Telegram bot is an Aviator-themed " +
          "entertainment simulator.\n\n" +
          "Features:\n\n" +
          "✈️ Random simulated multipliers\n" +
          "📡 Multiple fun signals\n" +
          "📊 Bot status\n" +
          "⚙️ Cloudflare Workers hosting\n\n" +
          "⚠️ The bot cannot predict real gambling " +
          "game outcomes.";

      }


      // OWNER

      else if (
        text === "👑 OWNER"
      ) {

        replyText =
          "👑 BOT OWNER\n\n" +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          `Creator: ${OWNER} 🌹\n\n` +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "AVIATOR PREDICTIOR\n" +
          `Version ${VERSION}`;

      }


      // HELP

      else if (
        text === "/help" ||
        text === "🆘 HELP"
      ) {

        replyText =
          "🆘 HELP CENTER\n\n" +
          "✈️ GET PREDICTION\n" +
          "Generates a random entertainment-only " +
          "Aviator-style multiplier.\n\n" +

          "📡 SIGNALS\n" +
          "Generates several random simulated signals.\n\n" +

          "📊 BOT STATUS\n" +
          "Shows bot information and runtime.\n\n" +

          "ℹ️ ABOUT\n" +
          "Information about the bot.\n\n" +

          "👑 OWNER\n" +
          "Shows the creator information.";

      }


      // DEFAULT

      else {

        replyText =
          "🤖 Please select an option from the menu below.\n\n" +
          "Use 🏠 HOME to return to the main menu.";

      }


      // SEND MESSAGE

      await sendMessage(
        env.TELEGRAM_BOT_TOKEN,
        chatId,
        replyText,
        mainKeyboard()
      );


      return new Response(
        "OK",
        {
          status: 200
        }
      );

    }

    catch (error) {

      console.error(error);

      return new Response(
        "Internal Server Error",
        {
          status: 500
        }
      );

    }

  }

};


/* ================================
   MAIN MENU
================================ */

function getMainMenu(firstName) {

  const uptime =
    getUptime();

  const date =
    getKenyaDate();

  return (

    "╔═══[ஜ۩: AVIATOR PREDICTIOR ۩ஜ]══╗\n" +

    `║➽ 𝗡𝗔𝗠𝗘: AVIATOR PREDICTIOR\n` +
    `║➽ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘: ${uptime}\n` +
    `║➽ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${VERSION}\n` +
    `║➽ 𝗢𝗪𝗡𝗘𝗥: ${OWNER}\n` +
    `║➽ 𝗣𝗜𝗡𝗚: ONLINE\n` +
    `║➽ 𝗗𝗔𝗧𝗘: ${date}\n` +

    "╚═══════ஜ۩۩ஜ═══════╝\n\n" +

    `Welcome, ${firstName}!\n\n` +

    "┏═══════════════════╗\n" +
    "┃  𝗢𝗨𝗥 𝗗𝗢𝗠𝗔𝗜𝗡𝗦\n" +
    "╠────────────────────╣\n" +
    `┃𝐶𝑟𝑒𝑎𝑡𝑜𝑟: UNIQUE ENGOKE LESLEY 🌹\n` +
    "┗۩═══════════════════╝\n\n" +

    "FOR ETHICAL USE ONLY\n" +
    "This bot generates close to precise prediction" +
    "© 2026 ALL RIGHTS RESERVED 2026"

  );

}


/* ================================
   TELEGRAM KEYBOARD
================================ */

function mainKeyboard() {

  return {

    keyboard: [

      [
        {
          text: "✈️ GET PREDICTION"
        }
      ],

      [
        {
          text: "📡 SIGNALS"
        },

        {
          text: "📊 BOT STATUS"
        }
      ],

      [
        {
          text: "ℹ️ ABOUT"
        },

        {
          text: "👑 OWNER"
        }
      ],

      [
        {
          text: "🆘 HELP"
        },

        {
          text: "🏠 HOME"
        }
      ]

    ],

    resize_keyboard: true,

    is_persistent: true

  };

}


/* ================================
   RANDOM FUN PREDICTION
================================ */

function generateFunPrediction() {

  const multipliers = [

    "1.15",
    "1.24",
    "1.38",
    "1.52",
    "1.67",
    "1.82",
    "2.05",
    "2.28",
    "2.55",
    "2.87",
    "3.15",
    "7.15",
    "0.15",
    "3.15",
    "error",
    "4.20",
    "5.50",
    "7.80"

  ];

  const signals = [

    "LOW",
    "MEDIUM",
    "HIGH",
    "RANDOM SIMULATION"

  ];

  return {

    multiplier:
      randomItem(multipliers),

    confidence:
      Math.floor(
        Math.random() * 40
      ) + 50,

    signal:
      randomItem(signals)

  };

}


/* ================================
   MULTIPLE SIGNALS
================================ */

function generateSignals() {

  let result = "";

  for (
    let i = 1;
    i <= 5;
    i++
  ) {

    const prediction =
      generateFunPrediction();

    result +=

      `SIGNAL ${i}\n` +
      `🚀 ${prediction.multiplier}x\n` +
      `📊 ${prediction.confidence}%\n\n`;

  }

  return result;

}


/* ================================
   RANDOM ITEM
================================ */

function randomItem(items) {

  return items[
    Math.floor(
      Math.random() *
      items.length
    )
  ];

}


/* ================================
   UPTIME
================================ */

function getUptime() {

  const seconds =
    Math.floor(
      (Date.now() - BOT_START_TIME) /
      1000
    );

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );

  const remainingSeconds =
    seconds % 60;

  return (
    `${hours}h ` +
    `${minutes}m ` +
    `${remainingSeconds}s`
  );

}


/* ================================
   KENYA DATE
================================ */

function getKenyaDate() {

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Africa/Nairobi",
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(
    new Date()
  );

}


/* ================================
   SEND TELEGRAM MESSAGE
================================ */

async function sendMessage(
  token,
  chatId,
  text,
  replyMarkup
) {

  if (!token) {

    throw new Error(
      "TELEGRAM_BOT_TOKEN secret is missing."
    );

  }


  const response =
    await fetch(

      `https://api.telegram.org/bot${token}/sendMessage`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:

          JSON.stringify({

            chat_id:
              chatId,

            text:
              text,

            reply_markup:
              replyMarkup

          })

      }

    );


  if (!response.ok) {

    const error =
      await response.text();

    throw new Error(
      "Telegram API error: " +
      error
    );

  }

            }
