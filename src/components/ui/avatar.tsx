import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export function Avatar({
  src,
  alt,
  size = "md",
  className,
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = { sm: 32, md: 40, lg: 56 };
  const px = dims[size];

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-xl bg-surface-hover ring-1 ring-border",
        className,
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-fg-secondary text-sm font-bold uppercase">
          {alt[0]}
        </div>
      )}
    </div>
  );
}
