export interface NavbarProps {
  session?: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
    } | null;
  } | null;
}
