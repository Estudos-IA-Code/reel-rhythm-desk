import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Film, Star, Calendar, Eye, EyeOff, ArrowLeft, ExternalLink, List, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

const GENRE_MAP: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  10770: "Filme de TV",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
};

const fetchPopularMovies = async (page: number, accessToken: string): Promise<TmdbResponse> => {
  const res = await fetch(
    `https://api2.edsongrifo.dev.br/webhook/tmdb?page=${page}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) throw new Error("Falha ao buscar filmes populares");
  return res.json();
};

const PopularMovieCard = ({
  movie,
  index,
}: {
  movie: TmdbMovie;
  index: number;
}) => {
  const navigate = useNavigate();
  const genres = movie.genre_ids
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);
  const year = movie.release_date?.split("-")[0];

  return (
    <div
      className="group relative flex gap-4 rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Poster */}
      <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Film className="h-8 w-8 opacity-30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-body text-lg font-semibold text-foreground truncate">
              {movie.title}
            </h3>
            {year && (
              <span className="flex-shrink-0 text-sm text-muted-foreground">
                {year}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="text-xs bg-secondary text-secondary-foreground border-0"
              >
                {genre}
              </Badge>
            ))}
          </div>

          {movie.overview && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {movie.overview}
            </p>
          )}
        </div>

        {/* Rating + Details */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-foreground">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1.5"
          >
            Ver detalhes
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const PopularSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="flex gap-4 rounded-lg border border-border bg-card p-4"
      >
        <Skeleton className="h-36 w-24 rounded-md bg-muted" />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Skeleton className="h-5 w-48 mb-2 bg-muted" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 bg-muted rounded-full" />
              <Skeleton className="h-5 w-20 bg-muted rounded-full" />
            </div>
          </div>
          <Skeleton className="h-5 w-24 bg-muted" />
        </div>
      </div>
    ))}
  </div>
);

const Popular = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { signOut, session } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["popular-movies", page],
    queryFn: () => fetchPopularMovies(page, session?.access_token ?? ""),
    enabled: !!session?.access_token,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg gradient-gold items-center justify-center flex">
                <Star className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-4xl tracking-wider text-foreground">
                POPULARES
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/watchlist")}
                className="gap-2 border-border text-foreground hover:bg-muted font-body"
              >
                <List className="h-4 w-4" />
                Watchlist
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <PopularSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <p className="text-foreground font-medium mb-2">
                Não foi possível carregar os filmes populares.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.results.map((movie, i) => (
                <PopularMovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-border text-foreground hover:bg-muted"
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {Math.min(data.total_pages, 500)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.min(data.total_pages, 500)}
                onClick={() => setPage((p) => p + 1)}
                className="border-border text-foreground hover:bg-muted"
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popular;
