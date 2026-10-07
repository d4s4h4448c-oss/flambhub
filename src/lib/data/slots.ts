export interface CatalogSlot {
  name: string;
  provider: string;
}

export const SLOT_CATALOG: CatalogSlot[] = [
  // Pragmatic Play
  { name: "Gates of Olympus", provider: "Pragmatic Play" },
  { name: "Gates of Olympus 1000", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza", provider: "Pragmatic Play" },
  { name: "Sweet Bonanza 1000", provider: "Pragmatic Play" },
  { name: "Starlight Princess", provider: "Pragmatic Play" },
  { name: "Starlight Princess 1000", provider: "Pragmatic Play" },
  { name: "Sugar Rush", provider: "Pragmatic Play" },
  { name: "Sugar Rush 1000", provider: "Pragmatic Play" },
  { name: "Big Bass Bonanza", provider: "Pragmatic Play" },
  { name: "Big Bass Splash", provider: "Pragmatic Play" },
  { name: "Big Bass Secrets of the Golden Lake", provider: "Pragmatic Play" },
  { name: "Wild West Gold", provider: "Pragmatic Play" },
  { name: "The Dog House", provider: "Pragmatic Play" },
  { name: "The Dog House Megaways", provider: "Pragmatic Play" },
  { name: "Buffalo King Megaways", provider: "Pragmatic Play" },
  { name: "Wolf Gold", provider: "Pragmatic Play" },
  { name: "Fruit Party", provider: "Pragmatic Play" },
  { name: "Madame Destiny Megaways", provider: "Pragmatic Play" },
  { name: "Zeus vs Hades", provider: "Pragmatic Play" },
  { name: "Wisdom of Athena", provider: "Pragmatic Play" },
  { name: "Forge of Olympus", provider: "Pragmatic Play" },
  { name: "Release the Kraken", provider: "Pragmatic Play" },
  { name: "Fire Stampede", provider: "Pragmatic Play" },
  { name: "Joker's Jewels", provider: "Pragmatic Play" },
  // Hacksaw Gaming
  { name: "Wanted Dead or a Wild", provider: "Hacksaw Gaming" },
  { name: "Chaos Crew", provider: "Hacksaw Gaming" },
  { name: "Chaos Crew II", provider: "Hacksaw Gaming" },
  { name: "R.I.P. City", provider: "Hacksaw Gaming" },
  { name: "Le Bandit", provider: "Hacksaw Gaming" },
  { name: "Gladiator Legends", provider: "Hacksaw Gaming" },
  { name: "Duel At Dawn", provider: "Hacksaw Gaming" },
  { name: "Hand of Anubis", provider: "Hacksaw Gaming" },
  { name: "SixSixSix", provider: "Hacksaw Gaming" },
  { name: "Pug Life", provider: "Hacksaw Gaming" },
  { name: "Joker Bombs", provider: "Hacksaw Gaming" },
  { name: "Drop'em", provider: "Hacksaw Gaming" },
  { name: "Fist of Destruction", provider: "Hacksaw Gaming" },
  { name: "Outlaws Inc.", provider: "Hacksaw Gaming" },
  { name: "Bear Money", provider: "Hacksaw Gaming" },
  { name: "Stack 'Em", provider: "Hacksaw Gaming" },
  { name: "Beast Below", provider: "Hacksaw Gaming" },
  // NoLimit City
  { name: "San Quentin", provider: "NoLimit City" },
  { name: "Mental", provider: "NoLimit City" },
  { name: "Fire in the Hole", provider: "NoLimit City" },
  { name: "Tombstone RIP", provider: "NoLimit City" },
  { name: "Punk Toilet", provider: "NoLimit City" },
  { name: "Dead Canary", provider: "NoLimit City" },
  { name: "Nine To Five", provider: "NoLimit City" },
  { name: "Disturbed", provider: "NoLimit City" },
  { name: "Book of Shadows", provider: "NoLimit City" },
  { name: "xWays Hoarder", provider: "NoLimit City" },
  // Play'n GO
  { name: "Book of Dead", provider: "Play'n GO" },
  { name: "Reactoonz", provider: "Play'n GO" },
  { name: "Legacy of Dead", provider: "Play'n GO" },
  { name: "Rise of Olympus", provider: "Play'n GO" },
  { name: "Moon Princess", provider: "Play'n GO" },
  { name: "Fire Joker", provider: "Play'n GO" },
  { name: "Pilgrim of Dead", provider: "Play'n GO" },
  { name: "Honey Rush", provider: "Play'n GO" },
  // NetEnt
  { name: "Starburst", provider: "NetEnt" },
  { name: "Gonzo's Quest", provider: "NetEnt" },
  { name: "Dead or Alive 2", provider: "NetEnt" },
  { name: "Twin Spin", provider: "NetEnt" },
  { name: "Mega Fortune", provider: "NetEnt" },
  // Push Gaming
  { name: "Jammin' Jars", provider: "Push Gaming" },
  { name: "Jammin' Jars 2", provider: "Push Gaming" },
  { name: "Razor Returns", provider: "Push Gaming" },
  { name: "Big Bamboo", provider: "Push Gaming" },
  { name: "Retro Tapes", provider: "Push Gaming" },
  { name: "Fat Rabbit", provider: "Push Gaming" },
  // Relax Gaming
  { name: "Money Train 2", provider: "Relax Gaming" },
  { name: "Money Train 3", provider: "Relax Gaming" },
  { name: "Iron Bank", provider: "Relax Gaming" },
  { name: "Temple Tumble", provider: "Relax Gaming" },
  // Big Time Gaming
  { name: "Bonanza", provider: "Big Time Gaming" },
  { name: "Extra Chilli", provider: "Big Time Gaming" },
  { name: "White Rabbit", provider: "Big Time Gaming" },
  // ELK Studios
  { name: "Pirots", provider: "ELK Studios" },
  { name: "Katmandu Gold", provider: "ELK Studios" },
  { name: "Nitropolis", provider: "ELK Studios" },
  { name: "Wild Toro", provider: "ELK Studios" },
  { name: "Cygnus", provider: "ELK Studios" },
  // Thunderkick
  { name: "Esqueleto Explosivo", provider: "Thunderkick" },
  { name: "Pink Elephants", provider: "Thunderkick" },
  { name: "Midas Golden Touch", provider: "Thunderkick" },
  // Yggdrasil
  { name: "Vikings Go Berzerk", provider: "Yggdrasil" },
  { name: "Holmes and the Stolen Stones", provider: "Yggdrasil" },
  { name: "Valley of the Gods", provider: "Yggdrasil" },
  // Quickspin
  { name: "Big Bad Wolf", provider: "Quickspin" },
  { name: "Sakura Fortune", provider: "Quickspin" },
  { name: "Eastern Emeralds", provider: "Quickspin" },
  // Divers
  { name: "Royal Potato", provider: "Print Studios" },
  { name: "PopRocks", provider: "AvatarUX" },
  { name: "Outlaws", provider: "Slotmill" },
  { name: "Barbarossa", provider: "Peter & Sons" },
];

export function searchSlots(query: string, limit = 8): CatalogSlot[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SLOT_CATALOG.filter(
    (slot) =>
      slot.name.toLowerCase().includes(q) ||
      slot.provider.toLowerCase().includes(q),
  )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}
