-- Drop foreign keys that depend on user_id columns first
ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "profiles_user_id_fkey";
ALTER TABLE "links" DROP CONSTRAINT IF EXISTS "links_user_id_fkey";
ALTER TABLE "clicks" DROP CONSTRAINT IF EXISTS "clicks_user_id_fkey";

-- Alter user id from UUID to TEXT (Firebase UIDs are not valid UUIDs)
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE TEXT;

-- Alter user_id columns from UUID to TEXT to match users.id
ALTER TABLE "profiles" ALTER COLUMN "user_id" SET DATA TYPE TEXT;
ALTER TABLE "links" ALTER COLUMN "user_id" SET DATA TYPE TEXT;
ALTER TABLE "clicks" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- Re-add foreign keys
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "links" ADD CONSTRAINT "links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
