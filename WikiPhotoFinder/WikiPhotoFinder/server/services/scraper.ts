import * as cheerio from 'cheerio';
import { type InsertStolperstein } from '@shared/schema';

export class StolpersteineScraperService {
  private async fetchHtml(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StolpersteineBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      throw error;
    }
  }

  async scrapeWikipedia(searchName: string): Promise<InsertStolperstein[]> {
    try {
      const url = 'https://de.wikipedia.org/wiki/Liste_der_Stolpersteine_in_Ulm';
      const html = await this.fetchHtml(url);
      const $ = cheerio.load(html);
      const results: InsertStolperstein[] = [];

      // Look for any table with rows containing the search names
      $('table tr').each((_, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length >= 4) {
          // Extract image from first column
          let imageUrl = '';
          const imgElement = cells.eq(0).find('img').first();
          if (imgElement.length) {
            const src = imgElement.attr('src');
            if (src) {
              imageUrl = src.startsWith('//') ? `https:${src}` : 
                        src.startsWith('/') ? `https://de.wikipedia.org${src}` : src;
              // Convert thumbnail to full size
              imageUrl = imageUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');
            }
          }

          // Extract inscription from second column
          const inscription = cells.eq(1).text().trim();
          
          // Extract address from third column - remove coordinate symbols
          const address = cells.eq(2).text().trim().replace(/♁.*$/, '').trim();
          
          // Extract name and biographical info from fourth column
          const nameLifeText = cells.eq(3).text().trim();
          
          // Extract name from the biographical text
          let name = '';
          let lifespan = '';
          
          // Try to extract name from various patterns
          const nameMatch = nameLifeText.match(/^([^,(]+)/);
          if (nameMatch) {
            name = nameMatch[1].trim();
            
            // Extract lifespan from parentheses like "(1888–1939)" or "(1888–)"
            const lifespanMatch = nameLifeText.match(/\((\d{4}[–-]\d{4}?)\)/);
            if (lifespanMatch) {
              lifespan = lifespanMatch[1];
            }
          }
          
          // Also try to extract name from inscription (HIER WOHNTE [NAME])
          if (!name && inscription) {
            const inscriptionNameMatch = inscription.match(/HIER WOHNTE\s+([A-ZÄÖÜ\s]+?)(?:\s+(?:GEB\.|VERH\.|JG\.))/);
            if (inscriptionNameMatch) {
              name = inscriptionNameMatch[1].trim();
            }
          }
          
          // Extract installation date from inscription if available
          let installDate = '';
          if (inscription) {
            // Look for patterns like "FLUCHT 1939" or "ERMORDET 24.12.1938"
            const dateMatch = inscription.match(/(\d{1,2}\.\d{1,2}\.\d{4}|\d{4})/);
            if (dateMatch) {
              installDate = dateMatch[1];
            }
          }
          
          // Check if the name matches the search term
          if (name && name.toLowerCase().includes(searchName.toLowerCase())) {
            console.log(`Found matching Stolperstein: ${name} at ${address}`);
            
            results.push({
              name,
              address: address || 'Adresse nicht verfügbar',
              lifespan: lifespan || 'Lebensdaten nicht verfügbar',
              installDate: installDate || 'Verlegedatum nicht verfügbar',
              imageUrl,
              source: 'wikipedia',
              sourceUrl: url,
            });
          }
        }
      });

      console.log(`Wikipedia scraper found ${results.length} results for "${searchName}"`);
      return results;
    } catch (error) {
      console.error('Wikipedia scraping failed:', error);
      return [];
    }
  }

  async scrapeStolpersteineUlm(searchName: string): Promise<InsertStolperstein[]> {
    try {
      const url = 'https://www.stolpersteine-fuer-ulm.de';
      const html = await this.fetchHtml(url);
      const $ = cheerio.load(html);
      const results: InsertStolperstein[] = [];

      // Parse the Stolpersteine-fuer-Ulm website structure
      $('.stolperstein-entry, .person-entry, article').each((_, entry) => {
        const $entry = $(entry);
        const name = $entry.find('h2, h3, .name, .person-name').first().text().trim();
        
        if (name && name.toLowerCase().includes(searchName.toLowerCase())) {
          const address = $entry.find('.address, .verlegeort, .location').first().text().trim() ||
                         $entry.find('p:contains("Verlegeort"), p:contains("Adresse")').text().replace(/^[^:]*:/, '').trim();
          
          const lifespan = $entry.find('.lifespan, .lebensdaten, .dates').first().text().trim() ||
                          $entry.find('p:contains("geb."), p:contains("geboren")').text().trim();
          
          const installDate = $entry.find('.install-date, .verlegedatum').first().text().trim() ||
                             $entry.find('p:contains("verlegt"), p:contains("Verlegung")').text().replace(/^[^:]*:/, '').trim();

          // Try to find associated image
          let imageUrl = '';
          const imgElement = $entry.find('img').first();
          if (imgElement.length) {
            const src = imgElement.attr('src');
            if (src) {
              imageUrl = src.startsWith('//') ? `https:${src}` : 
                        src.startsWith('/') ? `${url}${src}` : 
                        src.startsWith('http') ? src : `${url}/${src}`;
            }
          }

          results.push({
            name,
            address: address || 'Adresse nicht verfügbar',
            lifespan: lifespan || 'Lebensdaten nicht verfügbar',
            installDate: installDate || 'Verlegedatum nicht verfügbar',
            imageUrl,
            source: 'stolpersteine-fuer-ulm',
            sourceUrl: url,
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Stolpersteine-fuer-Ulm scraping failed:', error);
      return [];
    }
  }

  async searchAll(name: string): Promise<InsertStolperstein[]> {
    const [wikipediaResults, stolpersteineUlmResults] = await Promise.all([
      this.scrapeWikipedia(name),
      this.scrapeStolpersteineUlm(name),
    ]);

    return [...wikipediaResults, ...stolpersteineUlmResults];
  }
}

export const scraperService = new StolpersteineScraperService();
