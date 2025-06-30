import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stolpersteine = pgTable("stolpersteine", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  installDate: text("install_date"),
  lifespan: text("lifespan"),
  imageUrl: text("image_url"),
  source: text("source").notNull(), // 'wikipedia' or 'stolpersteine-fuer-ulm'
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStolpersteinSchema = createInsertSchema(stolpersteine).omit({
  id: true,
  createdAt: true,
});

export type InsertStolperstein = z.infer<typeof insertStolpersteinSchema>;
export type Stolperstein = typeof stolpersteine.$inferSelect;

export const searchSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
});

export type SearchRequest = z.infer<typeof searchSchema>;
