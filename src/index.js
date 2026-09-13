export default {
  async fetch(request, env) {
    try {
      // Browser test
      if (request.method === "GET") {
        return new Response("BOT ONLINE", {
          status: 200
        });
      }

      // Telegram webhook test
      if (request.method === "POST") {
        const update = await request.json();

        console.log("Telegram update received");

        // Immediately acknowledge Telegram
        return new Response("OK", {
          status: 200
        });
      }

      return new Response("OK", {
        status: 200
      });

    } catch (error) {
      console.log("ERROR:", error.message);

      return new Response("OK", {
        status: 200
      });
    }
  }
};
