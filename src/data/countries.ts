export interface CountryIQ {
  name: string;
  flag: string;
  avg: number;
}

export const COUNTRY_DATA: CountryIQ[] = [
  { name: "Japan", flag: "🇯🇵", avg: 106 },
  { name: "South Korea", flag: "🇰🇷", avg: 106 },
  { name: "Singapore", flag: "🇸🇬", avg: 106 },
  { name: "Hong Kong", flag: "🇭🇰", avg: 105 },
  { name: "Taiwan", flag: "🇹🇼", avg: 105 },
  { name: "Germany", flag: "🇩🇪", avg: 100 },
  { name: "Netherlands", flag: "🇳🇱", avg: 100 },
  { name: "United Kingdom", flag: "🇬🇧", avg: 99 },
  { name: "Australia", flag: "🇦🇺", avg: 99 },
  { name: "Canada", flag: "🇨🇦", avg: 99 },
  { name: "United States", flag: "🇺🇸", avg: 98 },
  { name: "France", flag: "🇫🇷", avg: 98 },
  { name: "China", flag: "🇨🇳", avg: 104 },
  { name: "Italy", flag: "🇮🇹", avg: 94 },
  { name: "Spain", flag: "🇪🇸", avg: 93 },
  { name: "Brazil", flag: "🇧🇷", avg: 84 },
  { name: "India", flag: "🇮🇳", avg: 82 },
  { name: "Nepal", flag: "🇳🇵", avg: 78 },
  { name: "World Average", flag: "🌍", avg: 100 },
];
