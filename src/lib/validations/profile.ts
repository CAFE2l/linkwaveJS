import { z } from "zod";
import { usernameSchema } from "./auth";

export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(180, "A bio deve ter no máximo 180 caracteres.").optional(),
  avatarUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  theme: z.enum(["wave", "midnight", "minimal", "aurora"]),
});

export const linkSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Informe um título.").max(60, "Use até 60 caracteres."),
  url: z.string().min(4, "Informe uma URL.").max(400, "URL muito longa."),
  icon: z.string().max(40).optional().or(z.literal("")),
});

export const reorderLinksSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
