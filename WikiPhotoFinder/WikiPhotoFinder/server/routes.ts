import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scraperService } from "./services/scraper";
import { searchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search for Stolpersteine by name
  app.post("/api/search", async (req, res) => {
    try {
      const { name } = searchSchema.parse(req.body);
      
      // First check local storage
      let results = await storage.searchStolpersteine(name);
      
      // If no results found locally, scrape from web sources
      if (results.length === 0) {
        console.log(`No local results for "${name}", scraping web sources...`);
        const scrapedResults = await scraperService.searchAll(name);
        
        // Store scraped results for future searches
        for (const result of scrapedResults) {
          const stored = await storage.createStolperstein(result);
          results.push(stored);
        }
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          message: `Keine Stolpersteine für "${name}" gefunden. Versuchen Sie eine andere Schreibweise.`,
          searchTerm: name
        });
      }
      
      res.json({ results, searchTerm: name });
    } catch (error) {
      console.error("Search error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Ungültige Suchanfrage", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Fehler bei der Suche. Bitte versuchen Sie es später erneut.",
        error: error instanceof Error ? error.message : "Unbekannter Fehler"
      });
    }
  });

  // Get all stored Stolpersteine
  app.get("/api/stolpersteine", async (req, res) => {
    try {
      const results = await storage.getAllStolpersteine();
      res.json({ results });
    } catch (error) {
      console.error("Get all stolpersteine error:", error);
      res.status(500).json({ 
        message: "Fehler beim Laden der Stolpersteine" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
