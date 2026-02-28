import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Calendar, Clock, Globe, Film, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1M2ExZWY0NDgzN2U4ODRlOTM0ZTA1NTE0NjYwM2U0MCIsIm5iZiI6MTc3MjIzMjEzNC4xODIwMDAyLCJzdWIiOiI2OWEyMWRjNmRlYWI5NjIwMDdjMTZjMzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IAaD6Eo767ZLWD4iEFIzxr1tNTpQG3ETgt6nEu1W6jE";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string | null;
  status: string;
  original_language: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  spoken_languages: { english_name: string; name: string }[];
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CreditsResponse {
  cast: CastMember[];
}

const fetchMovieDetails = async (id: string): Promise<MovieDetail> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Falha ao buscar detalhes do filme");
  return res.json();
};

const fetchMovieCredits = async (id: string): Promise<CreditsResponse> => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Falha ao buscar elenco");
  return res.json();
};

const formatCurrency = (value: number) =>
  value > 0
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" }).format(value)
    : "—";

const formatRuntime = (minutes: number | null) => {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}min`;
};

const DetailsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <Skeleton className="h-72 w-full rounded-xl bg-muted" />
    <div className="flex gap-6">
      <Skeleton className="h-72 w-48 rounded-lg bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-3/4 bg-muted" />
        <Skeleton className="h-5 w-1/2 bg-muted" />
        <Skeleton className="h-20 w-full bg-muted" />
      </div>
    </div>
  </div>
);

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["movie-details", id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });

  const { data: credits } = useQuery({
    queryKey: ["movie-credits", id],
    queryFn: () => fetchMovieCredits(id!),
    enabled: !!id,
  });

  // Check if movie is already in watchlist
  const { data: isInWatchlist } = useQuery({
    queryKey: ["watchlist-check", id],
    queryFn: async () => {
      if (!movie) return false;
      const { data } = await supabase
        .from("movies")
        .select("id")
        .eq("titulo", movie.title)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!movie,
  });

  const addToWatchlist = useMutation({
    mutationFn: async () => {
      if (!movie || !user) throw new Error("Dados indisponíveis");
      const year = movie.release_date ? parseInt(movie.release_date.split("-")[0]) : null;
      const genres = movie.genres.map((g) => g.name);
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : null;

      const { error } = await supabase.from("movies").insert({
        user_id: user.id,
        titulo: movie.title,
        categorias: genres,
        ano: year,
        poster_url: posterUrl,
        observacoes: movie.overview || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Filme adicionado à watchlist!");
      queryClient.invalidateQueries({ queryKey: ["watchlist-check", id] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: () => {
      toast.error("Erro ao adicionar filme.");
    },
  });

  const cast = credits?.cast.slice(0, 12) ?? [];

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      {movie?.backdrop_path && (
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-12">
        {/* Back button */}
        <div className={movie?.backdrop_path ? "-mt-20 relative z-10 mb-6" : "pt-8 mb-6"}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
        </div>

        {isLoading ? (
          <DetailsSkeleton />
        ) : isError || !movie ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <p className="text-foreground font-medium mb-2">
              Não foi possível carregar os detalhes do filme.
            </p>
            <Button variant="outline" onClick={() => navigate(-1)} className="border-border">
              Voltar
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Main info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0 w-48 mx-auto sm:mx-0">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-card"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] rounded-lg bg-muted flex items-center justify-center">
                    <Film className="h-12 w-12 text-muted-foreground opacity-30" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl tracking-wider text-foreground">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="mt-1 text-muted-foreground italic">"{movie.tagline}"</p>
                  )}
                </div>

                <Button
                  onClick={() => addToWatchlist.mutate()}
                  disabled={isInWatchlist || addToWatchlist.isPending}
                  className="w-fit gap-2"
                  variant={isInWatchlist ? "secondary" : "default"}
                >
                  {addToWatchlist.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isInWatchlist ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isInWatchlist ? "Na watchlist" : "Adicionar à watchlist"}
                </Button>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {movie.release_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(movie.release_date).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {formatRuntime(movie.runtime)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    <span className="font-semibold text-foreground">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span>({movie.vote_count.toLocaleString("pt-BR")} votos)</span>
                  </span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <Badge
                      key={g.id}
                      variant="secondary"
                      className="text-xs bg-secondary text-secondary-foreground border-0"
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>

                {/* Overview */}
                {movie.overview && (
                  <div>
                    <h2 className="text-xl tracking-wider text-foreground mb-2">SINOPSE</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {movie.overview}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Idioma", value: movie.spoken_languages?.[0]?.name || movie.original_language },
                { label: "Status", value: movie.status },
                { label: "Orçamento", value: formatCurrency(movie.budget) },
                { label: "Receita", value: formatCurrency(movie.revenue) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-card p-4 shadow-card"
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-xl tracking-wider text-foreground mb-4">ELENCO</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Film className="h-6 w-6 opacity-30" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-foreground truncate">{actor.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production companies */}
            {movie.production_companies.length > 0 && (
              <div>
                <h2 className="text-xl tracking-wider text-foreground mb-3">PRODUÇÃO</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.production_companies.map((company) => (
                    <Badge
                      key={company.id}
                      variant="outline"
                      className="text-xs border-border text-muted-foreground"
                    >
                      {company.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
