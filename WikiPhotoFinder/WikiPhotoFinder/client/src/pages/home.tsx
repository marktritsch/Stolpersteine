import { useState } from "react";
import SearchForm from "@/components/search-form";
import SearchResults from "@/components/search-results";
import { type Stolperstein } from "@shared/schema";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Stolperstein[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchResults = (results: Stolperstein[], term: string) => {
    setSearchResults(results);
    setSearchTerm(term);
    setSearchError("");
  };

  const handleSearchError = (error: string) => {
    setSearchError(error);
    setSearchResults([]);
  };

  const handleSearchStart = () => {
    setIsSearching(true);
  };

  const handleSearchEnd = () => {
    setIsSearching(false);
  };



  return (
    <div className="bg-memorial-light min-h-screen font-system">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-memorial-dark mb-2">
            Stolpersteine Ulm
          </h1>
          <p className="text-memorial-gray text-sm">
            Suche nach Gedenksteinen und Verlegeorten
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <SearchForm
          onSearchStart={handleSearchStart}
          onSearchEnd={handleSearchEnd}
          onSearchResults={handleSearchResults}
          onSearchError={handleSearchError}
          isSearching={isSearching}
        />

        <SearchResults
          results={searchResults}
          isSearching={isSearching}
          searchError={searchError}
          searchTerm={searchTerm}
        />

        {/* Info Section */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-memorial-dark mb-3">
            Über diese Suche
          </h3>
          <div className="space-y-2 text-sm text-memorial-gray">
            <p>Diese Anwendung durchsucht zwei Hauptquellen für Stolperstein-Informationen in Ulm:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Wikipedia-Seite "Liste der Stolpersteine in Ulm"</li>
              <li>Stolpersteine-fuer-Ulm.de Website</li>
            </ul>
            <p className="mt-3">
              Die Suche zeigt den Verlegeort und hochauflösende Bilder der Gedenksteine an, 
              damit die Inschriften gut lesbar sind.
            </p>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 mt-12 border-t border-gray-200">
        <div className="text-center text-sm text-memorial-gray">
          <p>Zum Gedenken an die Opfer des Nationalsozialismus</p>
          <p className="mt-2">Daten von Wikipedia und Stolpersteine-fuer-Ulm.de</p>
        </div>
      </footer>


    </div>
  );
}
