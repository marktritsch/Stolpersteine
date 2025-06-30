import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, AlertTriangle } from "lucide-react";
import { type Stolperstein } from "@shared/schema";

interface SearchResultsProps {
  results: Stolperstein[];
  isSearching: boolean;
  searchError: string;
  searchTerm: string;
}

export default function SearchResults({
  results,
  isSearching,
  searchError,
  searchTerm,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (searchError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-3 h-5 w-5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Suche fehlgeschlagen</h3>
              <p className="text-sm text-red-700 mt-1">{searchError}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0 && !isSearching && !searchError) {
    if (searchTerm) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="text-memorial-gray h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-memorial-dark mb-2">
              Keine Ergebnisse gefunden
            </h3>
            <p className="text-memorial-gray">
              Für "{searchTerm}" wurden keine Stolpersteine gefunden. 
              Versuchen Sie eine andere Schreibweise.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Search className="text-memorial-gray h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-memorial-dark mb-2">
            Keine Suchergebnisse
          </h3>
          <p className="text-memorial-gray">
            Geben Sie einen Namen ein, um nach Stolpersteinen zu suchen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-memorial-dark">
                {result.name}
              </h2>
              <Badge
                variant="secondary"
                className={
                  result.source === 'wikipedia'
                    ? 'bg-blue-100 text-memorial-blue'
                    : 'bg-green-100 text-green-800'
                }
              >
                {result.source === 'wikipedia' ? (
                  <>
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Wikipedia
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Stolpersteine-fuer-Ulm.de
                  </>
                )}
              </Badge>
            </div>

            <div className="flex flex-col space-y-6">
              {/* Image section - prioritized for mobile visibility */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-memorial-dark">
                  Gedenkstein
                </h3>
                {result.imageUrl ? (
                  <div>
                    <img
                      src={result.imageUrl}
                      alt={`Stolperstein für ${result.name}`}
                      className="w-full rounded-lg shadow-md"
                      style={{ height: 'auto', maxHeight: 'none', objectFit: 'contain' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <p className="text-memorial-gray text-sm">Bild nicht verfügbar</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-memorial-gray text-sm">Kein Bild verfügbar</p>
                  </div>
                )}

              </div>

              {/* Biographical information section */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-memorial-gray uppercase tracking-wide mb-1">
                    Verlegeort
                  </h3>
                  <p className="text-memorial-dark font-medium">{result.address}</p>
                </div>

                {result.installDate && (
                  <div>
                    <h3 className="text-sm font-medium text-memorial-gray uppercase tracking-wide mb-1">
                      Verlegedatum
                    </h3>
                    <p className="text-memorial-dark">{result.installDate}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
