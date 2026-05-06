const express = require("express");
const router = express.Router();

// ====== LOCAL ECO TRIVIA BANK ======
const triviaBank = [
  { trivia: "Recycling one aluminum can saves enough energy to run a TV for three hours.", quote: "The Earth does not belong to us. We belong to the Earth." },
  { trivia: "A single plastic bag can take up to 1,000 years to decompose in a landfill.", quote: "We do not inherit the earth from our ancestors. We borrow it from our children." },
  { trivia: "Glass can be recycled indefinitely without losing quality or purity.", quote: "The greatest threat to our planet is the belief that someone else will save it." },
  { trivia: "Americans throw away enough aluminum every month to rebuild the entire US commercial air fleet.", quote: "In every walk with nature, one receives far more than he seeks." },
  { trivia: "One ton of recycled paper saves 17 trees and 7,000 gallons of water.", quote: "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves." },
  { trivia: "E-waste represents only 2% of America's trash in landfills, but it equals 70% of overall toxic waste.", quote: "Only when the last tree is cut, the last fish caught, and the last river poisoned will we realize we cannot eat money." },
  { trivia: "Recycling one ton of plastic saves the equivalent of 1,000–2,000 gallons of gasoline.", quote: "Nature is not a place to visit. It is home." },
  { trivia: "The average American produces 4.4 lbs of garbage per day — that's 1,600 lbs per year!", quote: "A nation that destroys its soils destroys itself." },
  { trivia: "Composting food scraps can reduce household waste by up to 30%.", quote: "To waste, to destroy our natural resources, to skin and exhaust the land is to undermine the safety of our children." },
  { trivia: "A running faucet wastes about 2 gallons of water per minute.", quote: "We are the first generation to feel the impact of climate change and the last generation that can do something about it." },
  { trivia: "Cotton bags must be used 131 times to offset their production impact compared to a plastic bag used once.", quote: "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share." },
  { trivia: "Upcycling old furniture reduces demand for new wood and keeps 8 million tons of furniture out of landfills each year.", quote: "Being green is more than just buying 'eco'. It is an overall shift in the way we think about things." },
  { trivia: "A smartphone contains over 60 different elements, many of which can be recovered and reused.", quote: "The future belongs to those who believe in the beauty of their dreams — and in green energy." },
  { trivia: "Jeans require 10,000 litres of water to produce — equivalent to 10 years of drinking water for one person.", quote: "Think globally, act locally." },
  { trivia: "Recycling steel and tin cans saves between 60 and 74 percent of the energy used to produce them from raw materials.", quote: "We are living on this planet as if we had another one to go to." },
];

// ====== LOCAL ECOBOT RESPONSE BANK ======
const chatResponses = [
  { keywords: ["plastic", "bottle"], reply: "♻️ Plastic bottles can be upcycled into planters, bird feeders, or even self-watering garden systems! Clean them first, cut to your desired size, and get creative with paint." },
  { keywords: ["metal", "tin", "can", "steel"], reply: "🔩 Metal cans are perfect for upcycling! Use tin cans as pencil holders, small planters, candle holders, or even stacked into a stylish shelf organizer." },
  { keywords: ["fabric", "cloth", "textile", "denim", "jeans"], reply: "🧵 Old fabric and denim can become patchwork bags, rugs, wall art, or stuffing for pillows. Avoid sending textiles to landfill — they take 200+ years to break down!" },
  { keywords: ["ewaste", "e-waste", "electronic", "phone", "laptop", "computer"], reply: "💻 E-waste is toxic if landfilled. Donate working electronics to schools, or drop off at certified e-waste collection centers. Gold, silver, and copper can all be recovered from old devices." },
  { keywords: ["paper", "cardboard", "newspaper"], reply: "📦 Cardboard and paper are among the most recyclable materials! Use cardboard for DIY organizers, seedling starters, or compost it to enrich your garden soil." },
  { keywords: ["compost", "food waste", "kitchen"], reply: "🌱 Start composting your kitchen scraps! Fruit peels, coffee grounds, and vegetable waste can become rich fertilizer in just 6–8 weeks. Mix with dry leaves for best results." },
  { keywords: ["upcycle", "upcycling", "diy", "craft"], reply: "✨ Upcycling transforms waste into treasure! Old pallets become furniture, wine bottles become lamps, and worn tires become garden planters. The possibilities are endless!" },
  { keywords: ["recycle", "recycling"], reply: "♻️ Great question! Ensure items are clean before recycling. Recyclables contaminated with food can spoil entire batches. Check your local guidelines for accepted materials." },
  { keywords: ["energy", "electricity", "solar"], reply: "⚡ Switching to LED bulbs saves 75% more energy than incandescent bulbs. Unplugging devices on standby can save up to 10% on your electricity bill!" },
  { keywords: ["water", "save water"], reply: "💧 Fix leaky faucets — a dripping tap wastes 20 litres per day. Collect rainwater for plants, take shorter showers, and run dishwashers only when full." },
  { keywords: ["hello", "hi", "hey", "hii"], reply: "👋 Hello! I am EcoBot 🌍 — your guide to sustainable living, upcycling, and recycling. What eco-friendly topic can I help you with today?" },
  { keywords: ["tip", "tips", "advice", "help"], reply: "🌿 Here's a quick eco-tip: Start by auditing your trash for one week. You'll be surprised how much is recyclable or compostable! Small daily habits create massive long-term impact." },
  { keywords: ["glass", "bottle", "jar"], reply: "🫙 Glass jars and bottles are perfect for upcycling! Use them as food storage, candle holders, flower vases, or even DIY terrariums. Glass can be recycled infinitely without losing quality." },
  { keywords: ["wood", "furniture", "pallet"], reply: "🪵 Old wood and pallets can be turned into stunning furniture, shelves, garden beds, or wall art. Sand, stain, and seal them for a premium finish!" },
];

const defaultReplies = [
  "🌱 Great question! Sustainable living starts with small steps. Try reducing single-use plastics, composting food waste, and buying second-hand when possible.",
  "♻️ Every item you upcycle is one less thing in a landfill. Check out the Waste2Decor marketplace for inspiration!",
  "🌍 The best eco-habit you can build is being mindful of what you buy. Ask yourself: Do I need this? Can I get it second-hand? How will I dispose of it?",
  "💡 Pro tip: Repair before you replace! Many items that seem broken just need a small fix. This saves money and reduces waste.",
];

// ================= CHATBOT ENDPOINT =================
router.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ reply: "Prompt is required." });

  const lower = prompt.toLowerCase();
  
  // Find a matching response based on keywords
  const match = chatResponses.find(r => r.keywords.some(kw => lower.includes(kw)));
  
  if (match) {
    return res.json({ reply: match.reply });
  }

  // Random default reply
  const fallback = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  res.json({ reply: fallback });
});

// ================= DAILY TRIVIA ENDPOINT =================
router.get("/trivia", async (req, res) => {
  // Pick a random trivia+quote pair each time
  const random = triviaBank[Math.floor(Math.random() * triviaBank.length)];
  res.json(random);
});

module.exports = router;
