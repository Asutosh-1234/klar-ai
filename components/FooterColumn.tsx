import Link from "next/link";
import { FooterColumnProps } from "@/lib/types";

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-semibold text-on-background mb-2">{title}</h4>
      {links.map((link) => {
        const isHash = link.href.startsWith("#") || link.href === "#";
        const className = "text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30 text-sm";
        
        if (isHash) {
          return (
            <a key={link.label} className={className} href={link.href}>
              {link.label}
            </a>
          );
        }
        
        return (
          <Link key={link.label} className={className} href={link.href}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
