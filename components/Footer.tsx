import { FooterColumnProps } from "@/lib/types";
import { FooterColumn } from "@/components/FooterColumn";

const footerSections: FooterColumnProps[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#security" },
      { label: "API", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full py-20 bg-surface-sidebar border-t border-white/5">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-stack-lg text-left">
        <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
          <div className="font-headline-md text-headline-md font-bold text-on-background flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px] font-bold">stars</span>
            Aether
          </div>
          <p className="text-on-surface-variant max-w-xs">The premium AI operating system for modern executives.</p>
          <p className="text-on-surface-variant/50 text-sm mt-auto">© 2024 Aether AI. SOC2 Type II Certified.</p>
        </div>
        {footerSections.map((section) => (
          <FooterColumn key={section.title} {...section} />
        ))}
      </div>
    </footer>
  );
}
