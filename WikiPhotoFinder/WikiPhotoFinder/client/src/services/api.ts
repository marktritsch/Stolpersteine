// Client-side API service for static deployment
import { type Stolperstein } from "@shared/schema";

// Sample data for static deployment - in a real app, this could be pre-loaded from scraping
const sampleStolpersteine: Stolperstein[] = [
  {
    id: 1,
    name: "Rosa Hecht",
    address: "Olgastraße 85",
    installDate: "2013-07-15",
    lifespan: null,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Stolperstein_Rosa_Hecht_Ulm.jpg/800px-Stolperstein_Rosa_Hecht_Ulm.jpg",
    source: "Wikipedia",
    sourceUrl: "https://de.wikipedia.org/wiki/Liste_der_Stolpersteine_in_Ulm",
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Max Steiner",
    address: "Frauenstraße 32",
    installDate: "2014-11-09",
    lifespan: null,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Stolperstein_Max_Steiner_Ulm.jpg/800px-Stolperstein_Max_Steiner_Ulm.jpg",
    source: "Wikipedia",
    sourceUrl: "https://de.wikipedia.org/wiki/Liste_der_Stolpersteine_in_Ulm",
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Anna Müller",
    address: "Bahnhofstraße 15",
    installDate: "2015-05-27",
    lifespan: null,
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Stolperstein_Anna_Mueller_Ulm.jpg/800px-Stolperstein_Anna_Mueller_Ulm.jpg",
    source: "Stolpersteine-fuer-Ulm.de",
    sourceUrl: "https://stolpersteine-fuer-ulm.de",
    createdAt: new Date()
  }
];

class StaticApiService {
  private stolpersteine: Stolperstein[] = sampleStolpersteine;

  async searchStolpersteine(name: string): Promise<Stolperstein[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const searchTerm = name.toLowerCase().trim();
    
    const results = this.stolpersteine.filter(stolperstein => 
      stolperstein.name.toLowerCase().includes(searchTerm)
    );
    
    return results;
  }
}

export const staticApiService = new StaticApiService();