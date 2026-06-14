export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}
