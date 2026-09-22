export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export const mainNav: NavItem[] = [
  {
    label: "Workspace Ideas",
    href: "/categories/compact-home-office",
    children: [
      { label: "Workspace", href: "/categories/compact-home-office", description: "Full home office setup ideas" },
      { label: "Compact Essentials", href: "/categories/dorm-essentials", description: "Space-saving picks for tighter setups" },
    ],
  },
  { label: "Desk Setup", href: "/categories/desk-setup" },
  {
    label: "Shop by Category",
    href: "/categories",
    children: [
      { label: "Chairs", href: "/categories/chairs", description: "Task, ergonomic, and kneeling chairs" },
      { label: "Monitors", href: "/categories/monitors", description: "4K, USB-C, and gaming monitors, arms & stands" },
      { label: "Lighting", href: "/categories/lighting", description: "Desk lamps and ring lights" },
      { label: "Accessories", href: "/categories/accessories", description: "Cable management, keyboards & more" },
    ],
  },
  { label: "Work Better", href: "/categories/small-room-storage" },
  { label: "Compare", href: "/compare" },
];

export const footerNav = {
  categories: [
    { label: "Desk Setup", href: "/categories/desk-setup" },
    { label: "Workspace", href: "/categories/compact-home-office" },
    { label: "Chairs", href: "/categories/chairs" },
    { label: "Monitors", href: "/categories/monitors" },
    { label: "Lighting", href: "/categories/lighting" },
    { label: "Accessories", href: "/categories/accessories" },
    { label: "Work Better", href: "/categories/small-room-storage" },
    { label: "Compact Essentials", href: "/categories/dorm-essentials" },
  ],
  company: [
    { label: "About Us", href: "/about-workcocoon" },
    { label: "How We Review", href: "/how-we-review" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};
