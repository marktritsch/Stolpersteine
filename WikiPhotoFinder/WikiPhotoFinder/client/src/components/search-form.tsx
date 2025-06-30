import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Stolperstein } from "@shared/schema";
import { staticApiService } from "@/services/api";

interface SearchFormProps {
  onSearchStart: () => void;
  onSearchEnd: () => void;
  onSearchResults: (results: Stolperstein[], searchTerm: string) => void;
  onSearchError: (error: string) => void;
  isSearching: boolean;
}

export default function SearchForm({
  onSearchStart,
  onSearchEnd,
  onSearchResults,
  onSearchError,
  isSearching,
}: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async (name: string) => {
    try {
      onSearchStart();
      const results = await staticApiService.searchStolpersteine(name);
      onSearchResults(results, name);
      toast({
        title: "Suche erfolgreich",
        description: `${results.length} Ergebnis(se) für "${name}" gefunden.`,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Fehler bei der Suche";
      onSearchError(errorMessage);
      toast({
        title: "Suche fehlgeschlagen",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      onSearchEnd();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nameInput" className="block text-sm font-medium text-memorial-dark mb-2">
            Name der Person
          </Label>
          <div className="relative">
            <Input
              id="nameInput"
              type="text"
              placeholder="z.B. Anna Bernheim"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-memorial-blue focus:border-memorial-blue transition-colors text-memorial-dark"
              disabled={isSearching}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-memorial-gray h-4 w-4" />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="w-full bg-memorial-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 focus:ring-2 focus:ring-memorial-blue focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suche läuft...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Suchen
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
