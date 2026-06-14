import { FooterColumnProps } from "@/lib/types";

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-semibold text-on-background mb-2">{title}</h4>
      {links.map((link) => (
        <a
          key={link.label}
          className="text-on-surface-variant hover:text-primary transition-colors hover:underline decoration-primary/30"
          href={link.href}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
