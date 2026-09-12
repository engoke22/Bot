/**
 * TELEGRAM BOT FOR CLOUDFLARE WORKERS
 *
 * IMPORTANT:
 * Add your Telegram bot token in Cloudflare as a Secret named:
 *
 * TELEGRAM_BOT_TOKEN
 *
 * Do NOT paste your token directly into this code.
 */


const facts = [
  "Honey can remain edible for an extremely long time when stored properly.",
  "Octopuses have three hearts.",
  "A day on Venus is longer than one year on Venus.",
  "Bananas are botanically classified as berries.",
  "Your brain uses a significant amount of your body's energy."
];


const quotes = [
  "Small progress every day adds up to big results.",
  "Start where you are. Use what you have. Do what you can.",
  "Consistency is often more powerful than motivation.",
  "Your future is created by what you do today."
];


export default {

  async fetch(request, env) {

    // When you open the Worker URL in a browser
    if (request.method === "GET") {
      return new Response(
        "Telegram Bot is online and ready!",
        {
          status: 200
        }
      );
    }


    // Telegram sends updates using POST
    if (request.method !== "POST") {
      return new Response(
        "Method not allowed",
        {
          status: 405
        }
      );
    }


    try {

      // Receive Telegram update
      const update = await request.json();


      // Ignore updates without normal messages
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
        "Friend";

      const text =
        (update.message.text || "").trim();


      let replyText;

      const replyMarkup = mainMenu();


      // START OR HOME
      if (
        text === "/start" ||
        text === "🏠 Home"
      ) {

        replyText =
          `Welcome, ${firstName}! 👋\n\n` +
          "I am your Cloudflare-powered Telegram assistant.\n\n" +
          "Choose something from the menu below.";

      }


      // HELP
      else if (
        text === "/help" ||
        text === "🆘 Help"
      ) {

        replyText =
          "🆘 HELP CENTER\n\n" +
          "Here is what you can do:\n\n" +
          "🎲 Random Fact — Learn something interesting\n" +
          "💡 Daily Inspiration — Get motivation\n" +
          "🎯 Mini Challenge — Receive a challenge\n" +
          "📊 My Profile — View your Telegram information\n" +
          "ℹ️ About — Learn about this bot\n" +
          "🏠 Home — Return to the main menu";

      }


      // RANDOM FACT
      else if (
        text === "/fact" ||
        text === "🎲 Random Fact"
      ) {

        const fact =
          pickRandom(facts);

        replyText =
          "🎲 RANDOM FACT\n\n" +
          fact;

      }


      // DAILY INSPIRATION
      else if (
        text === "💡 Daily Inspiration"
      ) {

        const quote =
          pickRandom(quotes);

        replyText =
          "💡 DAILY INSPIRATION\n\n" +
          `"${quote}"\n\n` +
          "Keep moving forward.";

      }


      // MINI CHALLENGE
      else if (
        text === "🎯 Mini Challenge"
      ) {

        const challenges = [

          "Take 10 minutes today to learn something new.",

          "Write down one goal you want to achieve this week.",

          "Organize one small part of your workspace.",

          "Send a positive message to someone.",

          "Spend 15 minutes improving a skill."

        ];


        replyText =
          "🎯 MINI CHALLENGE\n\n" +
          pickRandom(challenges) +
          "\n\nCome back tomorrow for another challenge!";

      }


      // PROFILE
      else if (
        text === "📊 My Profile"
      ) {

        const username =
          update.message.from?.username
            ? "@" + update.message.from.username
            : "Not set";


        replyText =
          "📊 YOUR PROFILE\n\n" +
          `👤 Name: ${firstName}\n` +
          `🆔 Telegram ID: ${update.message.from.id}\n` +
          `🔗 Username: ${username}\n\n` +
          "More profile features can be added later.";

      }


      // ABOUT
      else if (
        text === "ℹ️ About"
      ) {

        replyText =
          "ℹ️ ABOUT THIS BOT\n\n" +
          "This is a Telegram bot powered by Cloudflare Workers.\n\n" +
          "Current features:\n\n" +
          "• Interactive menu\n" +
          "• Random facts\n" +
          "• Daily inspiration\n" +
          "• Mini challenges\n" +
          "• Basic profile information\n\n" +
          "More advanced features can be added later.";

      }


      // DEFAULT RESPONSE
      else {

        replyText =
          "🤖 I received your message:\n\n" +
          `"${text}"\n\n` +
          "Please choose an option from the menu below or type /help.";

      }


      // SEND RESPONSE TO TELEGRAM
      await sendMessage(

        env.TELEGRAM_BOT_TOKEN,

        chatId,

        replyText,

        replyMarkup

      );


      return new Response(
        "OK",
        {
          status: 200
        }
      );


    } catch (error) {

      console.error(
        "Worker error:",
        error
      );


      return new Response(
        "Internal server error",
        {
          status: 500
        }
      );

    }

  }

};



// MAIN MENU

function mainMenu() {

  return {

    keyboard: [

      [
        {
          text: "🎲 Random Fact"
        },

        {
          text: "💡 Daily Inspiration"
        }
      ],


      [
        {
          text: "🎯 Mini Challenge"
        },

        {
          text: "📊 My Profile"
        }
      ],


      [
        {
          text: "🆘 Help"
        },

        {
          text: "ℹ️ About"
        }
      ],


      [
        {
          text: "🏠 Home"
        }
      ]

    ],


    resize_keyboard: true,

    is_persistent: true

  };

}



// PICK RANDOM ITEM

function pickRandom(items) {

  return items[
    Math.floor(
      Math.random() *
      items.length
    )
  ];

}



// SEND MESSAGE TO TELEGRAM

async function sendMessage(
  token,
  chatId,
  text,
  replyMarkup
) {

  // Check if token exists
  if (!token) {

    throw new Error(

      "TELEGRAM_BOT_TOKEN is missing. " +
      "Add it in Cloudflare Worker Settings."

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


  // Check for Telegram errors
  if (!response.ok) {

    const error =
      await response.text();


    throw new Error(

      "Telegram API error: " +
      error

    );

  }

      }
