import { useState, useMemo, useCallback } from "react";
import MovieHeader from "@/components/movies/MovieHeader";
import MovieFilters from "@/components/movies/MovieFilters";
import MovieCard from "@/components/movies/MovieCard";
import MovieModal from "@/components/movies/MovieModal";
import DeleteConfirmDialog from "@/components/movies/DeleteConfirmDialog";
import MovieEmptyState from "@/components/movies/MovieEmptyState";
import MovieErrorState from "@/components/movies/MovieErrorState";
import MovieSkeleton from "@/components/movies/MovieSkeleton";
import MoviePagination from "@/components/movies/MoviePagination";
import { useMovies } from "@/hooks/useMovies";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { Movie } from "@/types/movie";

const CATEGORIAS_DISPONIVEIS = [
  "Ação", "Aventura", "Comédia", "Drama", "Ficção Científica",
  "Terror", "Romance", "Animação", "Documentário", "Suspense",
];

const ITEMS_PER_PAGE = 6;

const Index = () => {
  const { signOut } = useAuth();
  const { movies, isLoading, isError, refetch, createMovie, updateMovie, toggleAssistido, deleteMovie } = useMovies();

  const [busca, setBusca] = useState("");
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const movieToDelete = movies.find((m) => m.id === deleteId);

  const filteredMovies = useMemo(() => {
    let result = movies;
    if (busca.trim()) {
      const term = busca.toLowerCase();
      result = result.filter((m) => m.titulo.toLowerCase().includes(term));
    }
    if (categoriasFiltro.length > 0) {
      result = result.filter((m) =>
        categoriasFiltro.some((c) => m.categorias.includes(c))
      );
    }
    return result;
  }, [movies, busca, categoriasFiltro]);

  const totalPaginas = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  const handleBuscaChange = useCallback((val: string) => {
    setBusca(val);
    setPaginaAtual(1);
  }, []);

  const handleCategoriasChange = useCallback((cats: string[]) => {
    setCategoriasFiltro(cats);
    setPaginaAtual(1);
  }, []);

  const handleToggleAssistido = useCallback((id: string, valor: boolean) => {
    toggleAssistido.mutate({ id, assistido: valor });
  }, [toggleAssistido]);

  const handleAbrirCriar = useCallback(() => {
    setEditingMovie(null);
    setModalOpen(true);
  }, []);

  const handleAbrirEditar = useCallback((id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (movie) {
      setEditingMovie(movie);
      setModalOpen(true);
    }
  }, [movies]);

  const handleSalvarFilme = useCallback((payload: Omit<Movie, "id" | "assistido">) => {
    if (editingMovie) {
      updateMovie.mutate({ id: editingMovie.id, ...payload });
    } else {
      createMovie.mutate(payload);
    }
    setModalOpen(false);
    setEditingMovie(null);
  }, [editingMovie, updateMovie, createMovie]);

  const handleConfirmarExcluir = useCallback(() => {
    if (deleteId) {
      deleteMovie.mutate(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, deleteMovie]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-2">
            <MovieHeader onAbrirCriar={handleAbrirCriar} />
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <MovieFilters
            busca={busca}
            categoriasSelecionadas={categoriasFiltro}
            categoriasDisponiveis={CATEGORIAS_DISPONIVEIS}
            onBuscarChange={handleBuscaChange}
            onCategoriasChange={handleCategoriasChange}
          />

          {isLoading ? (
            <MovieSkeleton />
          ) : isError ? (
            <MovieErrorState onRetry={() => refetch()} />
          ) : paginatedMovies.length === 0 ? (
            <MovieEmptyState onAbrirCriar={handleAbrirCriar} />
          ) : (
            <div className="space-y-3">
              {paginatedMovies.map((movie, i) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={i}
                  onToggleAssistido={handleToggleAssistido}
                  onAbrirEditar={handleAbrirEditar}
                  onSolicitarExcluir={setDeleteId}
                />
              ))}
            </div>
          )}

          <MoviePagination
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onPaginar={setPaginaAtual}
          />
        </div>
      </div>

      <MovieModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingMovie(null); }}
        onSalvar={handleSalvarFilme}
        movie={editingMovie}
        categoriasDisponiveis={CATEGORIAS_DISPONIVEIS}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        movieTitle={movieToDelete?.titulo ?? ""}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleConfirmarExcluir}
      />
    </div>
  );
};

export default Index;
