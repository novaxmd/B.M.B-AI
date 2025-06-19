// ✅ chatbot.js (plugin/chatbot.js)
const axios = require("axios");
const { cmd } = require("../command");

let chatbotActive = false;

// 🔘 Toggle chatbot on/off
cmd({
  pattern: "chatbot",
  desc: "Toggle AI auto-reply chatbot",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { text, reply, isCreator }) => {
  if (!isCreator) return reply("❌ Only the bot owner can toggle chatbot.");
  const lower = text.toLowerCase();

  if (lower === "on") {
    chatbotActive = true;
    return reply("✅ ChatBot auto-reply has been enabled everywhere.");
  } else if (lower === "off") {
    chatbotActive = false;
    return reply("❌ ChatBot auto-reply has been disabled.");
  } else {
    return reply(`✴️ Usage:\n.chatbot on\n.chatbot off\n\n📡 Current Status: ${chatbotActive ? "ON ✅" : "OFF ❌"}`);
  }
});

// 💬 Auto reply to all messages if chatbot is active
cmd({
  pattern: /^(?!.).+/s,
  fromMe: false,
  dontAddCommandList: true,
}, async (conn, mek, m, { body }) => {
  if (!chatbotActive || !body || body.length > 500) return;

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    mentionedJid: [m.sender],
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "B.M.B-XMD",
      serverMessageId: 0x8f
    }
  };

  if (body.toLowerCase().includes("what is your name")) {
    return conn.sendMessage(m.chat, {
      text: "My name is B.M.B-XMD",
      contextInfo
    }, { quoted: mek });
  }

  try {
    const res = await axios.get("https://apis-keith.vercel.app/ai/gpt", {
      params: { text: body }
    });

    const ai = res?.data?.response || res?.data?.reply || "No response from AI.";

    await conn.sendMessage(m.chat, {
      text: `🤖 AI: ${ai}`,
      contextInfo
    }, { quoted: mek });

  } catch (e) {
    return conn.sendMessage(m.chat, {
      text: "❌ Error talking to AI.",
      contextInfo
    }, { quoted: mek });
  }
});