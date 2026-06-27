import type { ComponentProps } from "react";

type CustomLinkIconProps = {
  src: string;
  alt: string;
  className?: string;
} & Omit<ComponentProps<"img">, "src" | "alt" | "className">;

export function CustomLinkIcon({
  src,
  alt,
  className = "size-9",
  ...props
}: CustomLinkIconProps) {
  return (
    <span
      className={`${className} inline-flex shrink-0 overflow-hidden rounded-full border border-white/60 bg-white/40 shadow-md`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
        {...props}
      />
    </span>
  );
}
