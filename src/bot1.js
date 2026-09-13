const OWNER = "Unique Engoke Lesley";
const VERSION = "v1.0.0";

const facts = [
  "Stay disciplined and manage your decisions carefully.",
  "Small progress can become big progress over time.",
  "Consistency is more valuable than rushing.",
  "Entertainment should always remain entertainment."
];

export default {
  async fetch(request, env) {

    // Browser test
    if (request.method === "GET") {
      return new Response(
        "AVIATOR PREDICTIOR BOT IS ONLINE",
        {
          status: 200
        }
      );
    }

    // Telegram webhook
    if (request.method !== "POST") {
      return new Response(
        "Method Not Allowed",
        {
          status: 405
        }
      );
    }

    try {

      // Read Telegram update
      const update = await request.json();

      // Ignore unsupported Telegram updates
      if (!update.message) {
        return new Response("OK", {
          status: 200
        });
      }

      const chatId = update.message.chat.id;

      const firstName =
        update.message.from?.first_name ||
        "User";

      const text =
        (update.message.text || "").trim();

      let replyText;


      // START

      if (
        text === "/start" ||
        text === "🏠 HOME"
      ) {

        replyText = mainMenu(firstName);

      }


      // FUN SIMULATION

      else if (
        text === "✈️ GET PREDICTION"
      ) {

        const multiplier =
          generateMultiplier();

        replyText =
          "✈️ AVIATOR FUN SIMULATION\n\n" +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "🚀 SIMULATED RESULT\n\n" +
          `${multiplier}x\n\n` +
          "━━━━━━━━━━━━━━━━━━\n\n" +
          "This is randomly generated for entertainment.\n" +
          "It does not predict a real Aviator game.";

      }


      // SIGNALS

      else if (
        text === "📡 SIGNALS"
      ) {

        replyText =
          generateSignals();

      }


      // STATUS

      else if (
        text === "📊 BOT STATUS"
      ) {

        replyText =
          "📊 BOT STATUS\n\n" +
          "🟢 Status: ONLINE\n" +
          `⚙️ Version: ${VERSION}\n` +
          `👑 Owner: ${OWNER}\n` +
          `📅 Date: ${getDate()}`;

      }


      // ABOUT

      else if (
        text === "ℹ️ ABOUT"
      ) {

        replyText =
          "ℹ️ AVIATOR PREDICTIOR\n\n" +
          "This bot is a fun entertainment simulator.\n\n" +
          "The generated multipliers and signals are random.\n\n" +
          "They do not predict or guarantee real gambling outcomes.";

      }


      // OWNER

      else if (
        text === "👑 OWNER"
      ) {

        replyText =
          "👑 OWNER INFORMATION\n\n" +
          `Creator: ${OWNER} 🌹\n\n` +
          `Version: ${VERSION}`;

      }


      // HELP

      else if (
        text === "🆘 HELP" ||
        text === "/help"
      ) {

        replyText =
          "🆘 HELP\n\n" +
          "✈️ GET PREDICTION\n" +
          "Generate a random fun simulation.\n\n" +
          "📡 SIGNALS\n" +
          "Generate several random simulations.\n\n" +
          "📊 BOT STATUS\n" +
          "View bot information.";

      }


      // DEFAULT

      else {

        replyText =
          "Welcome! Please choose an option from the menu.";

      }


      // IMPORTANT: Send message

      const telegramResponse =
        await fetch(
          `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              chat_id: chatId,
              text: replyText,
              reply_markup: mainKeyboard()
            })
          }
        );


      // Log Telegram errors without crashing blindly

      if (!telegramResponse.ok) {

        const errorText =
          await telegramResponse.text();

        console.error(
          "Telegram API error:",
          errorText
        );

      }


      // Always acknowledge Telegram

      return new Response(
        "OK",
        {
          status: 200
        }
      );

    }

    catch (error) {

      console.error(
        "WORKER ERROR:",
        error.message
      );


      // Return OK so Telegram does not keep retrying
      // The actual error will appear in Cloudflare logs.

      return new Response(
        "OK",
        {
          status: 200
        }
      );

    }

  }
};


/* =========================
   MAIN MENU
========================= */

function mainMenu(firstName) {

  return (
    "╔═══[ஜ۩: AVIATOR PREDICTIOR ۩ஜ]══╗\n" +
    "║➽ 𝗡𝗔𝗠𝗘: AVIATOR PREDICTIOR\n" +
    "║➽ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘: ONLINE\n" +
    `║➽ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${VERSION}\n` +
    `║➽ 𝗢𝗪𝗡𝗘𝗥: ${OWNER}\n` +
    "║➽ 𝗣𝗜𝗡𝗚: ONLINE\n" +
    `║➽ 𝗗𝗔𝗧𝗘: ${getDate()}\n` +
    "╚═══════ஜ۩۩ஜ═══════╝\n\n" +

    `Welcome ${firstName}!\n\n` +

    "┏═══════════════════╗\n" +
    "┃  𝗢𝗨𝗥 𝗗𝗢𝗠𝗔𝗜𝗡𝗦\n" +
    "╠────────────────────╣\n" +
    "┃𝐶𝑟𝑒𝑎𝑡𝑜𝑟: UNIQUE ENGOKE LESLEY 🌹\n" +
    "┗۩═══════════════════╝\n\n" +

    "⚠️ Entertainment simulation only."
  );

}


/* =========================
   KEYBOARD
========================= */

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


/* =========================
   RANDOM MULTIPLIER
========================= */

function generateMultiplier() {

  const numbers = [
    "1.15",
    "1.25",
    "1.50",
    "1.75",
    "2.00",
    "2.30",
    "2.75",
    "3.20",
    "4.50",
    "5.00"
  ];

  return numbers[
    Math.floor(
      Math.random() *
      numbers.length
    )
  ];

}


/* =========================
   RANDOM SIGNALS
========================= */

function generateSignals() {

  let result =
    "📡 FUN SIMULATED SIGNALS\n\n";

  for (
    let i = 1;
    i <= 5;
    i++
  ) {

    result +=
      `SIGNAL ${i}: 🚀 ${generateMultiplier()}x\n`;

  }

  result +=
    "\n⚠️ Random entertainment simulation only.";

  return result;

}


/* =========================
   DATE
========================= */

function getDate() {

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
