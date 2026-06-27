import { PublicLinkButton } from "@/components/shared/public-link-button";
import type { Link } from "@/types/database";

export function ProfileLinkButton({ link }: { link: Link }) {
  return <PublicLinkButton link={link} />;
}
