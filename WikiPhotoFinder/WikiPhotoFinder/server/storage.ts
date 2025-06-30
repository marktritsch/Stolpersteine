import { stolpersteine, type Stolperstein, type InsertStolperstein } from "@shared/schema";

export interface IStorage {
  searchStolpersteine(name: string): Promise<Stolperstein[]>;
  createStolperstein(stolperstein: InsertStolperstein): Promise<Stolperstein>;
  getAllStolpersteine(): Promise<Stolperstein[]>;
}

export class MemStorage implements IStorage {
  private stolpersteine: Map<number, Stolperstein>;
  private currentId: number;

  constructor() {
    this.stolpersteine = new Map();
    this.currentId = 1;
  }

  async searchStolpersteine(name: string): Promise<Stolperstein[]> {
    const searchTerm = name.toLowerCase().trim();
    return Array.from(this.stolpersteine.values()).filter(
      (stolperstein) => 
        stolperstein.name.toLowerCase().includes(searchTerm)
    );
  }

  async createStolperstein(insertStolperstein: InsertStolperstein): Promise<Stolperstein> {
    const id = this.currentId++;
    const stolperstein: Stolperstein = { 
      id,
      name: insertStolperstein.name,
      address: insertStolperstein.address,
      source: insertStolperstein.source,
      installDate: insertStolperstein.installDate || null,
      lifespan: insertStolperstein.lifespan || null,
      imageUrl: insertStolperstein.imageUrl || null,
      sourceUrl: insertStolperstein.sourceUrl || null,
      createdAt: new Date()
    };
    this.stolpersteine.set(id, stolperstein);
    return stolperstein;
  }

  async getAllStolpersteine(): Promise<Stolperstein[]> {
    return Array.from(this.stolpersteine.values());
  }
}

export const storage = new MemStorage();
