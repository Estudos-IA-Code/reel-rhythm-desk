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
import type { Movie } from "@/types/movie";

const CATEGORIAS_DISPONIVEIS = [
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Ficção Científica",
  "Terror",
  "Romance",
  "Animação",
  "Documentário",
  "Suspense",
];

const ITEMS_PER_PAGE = 6;

const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    titulo: "Interestelar",
    categorias: ["Ficção Científica", "Drama"],
    ano: 2014,
    posterUrl: "https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    assistido: true,
    observacoes: "Uma obra-prima de Christopher Nolan sobre viagens no tempo e amor.",
  },
  {
    id: "2",
    titulo: "Parasita",
    categorias: ["Drama", "Suspense"],
    ano: 2019,
    posterUrl: "https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    assistido: true,
  },
  {
    id: "3",
    titulo: "Duna: Parte Dois",
    categorias: ["Ficção Científica", "Aventura"],
    ano: 2024,
    posterUrl: "https://image.tmdb.org/t/p/w300/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
    assistido: false,
    observacoes: "Continuação épica da saga de Paul Atreides.",
  },
  {
    id: "4",
    titulo: "Oppenheimer",
    categorias: ["Drama"],
    ano: 2023,
    posterUrl: "https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    assistido: false,
  },
  {
    id: "5",
    titulo: "Divertida Mente 2",
    categorias: ["Animação", "Comédia"],
    ano: 2024,
    posterUrl: "https://image.tmdb.org/t/p/w300/xeqPJshYPVJx1bNuoMfOdBz5SQ1.jpg",
    assistido: false,
  },
  {
    id: "6",
    titulo: "O Poderoso Chefão",
    categorias: ["Drama"],
    ano: 1972,
    assistido: true,
    observacoes: "Clássico absoluto do cinema.",
  },
  {
    id: "7",
    titulo: "Mad Max: Estrada da Fúria",
    categorias: ["Ação", "Aventura"],
    ano: 2015,
    posterUrl: "https://image.tmdb.org/t/p/w300/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    assistido: false,
  },
];

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [busca, setBusca] = useState("");
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const movieToDelete = movies.find((m) => m.id === deleteId);

  // Filtered movies
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

  // Pagination
  const totalPaginas = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  // Reset page on filter change
  const handleBuscaChange = useCallback((val: string) => {
    setBusca(val);
    setPaginaAtual(1);
  }, []);

  const handleCategoriasChange = useCallback((cats: string[]) => {
    setCategoriasFiltro(cats);
    setPaginaAtual(1);
  }, []);

  const handleToggleAssistido = useCallback((id: string, valor: boolean) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, assistido: valor } : m))
    );
  }, []);

  const handleAbrirCriar = useCallback(() => {
    setEditingMovie(null);
    setModalOpen(true);
  }, []);

  const handleAbrirEditar = useCallback(
    (id: string) => {
      const movie = movies.find((m) => m.id === id);
      if (movie) {
        setEditingMovie(movie);
        setModalOpen(true);
      }
    },
    [movies]
  );

  const handleSalvarFilme = useCallback(
    (payload: Omit<Movie, "id" | "assistido">) => {
      if (editingMovie) {
        setMovies((prev) =>
          prev.map((m) =>
            m.id === editingMovie.id ? { ...m, ...payload } : m
          )
        );
      } else {
        const newMovie: Movie = {
          ...payload,
          id: crypto.randomUUID(),
          assistido: false,
        };
        setMovies((prev) => [newMovie, ...prev]);
      }
      setModalOpen(false);
      setEditingMovie(null);
    },
    [editingMovie]
  );

  const handleConfirmarExcluir = useCallback(() => {
    if (deleteId) {
      setMovies((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    }
  }, [deleteId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <MovieHeader onAbrirCriar={handleAbrirCriar} />

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
            <MovieErrorState onRetry={() => window.location.reload()} />
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
        onClose={() => {
          setModalOpen(false);
          setEditingMovie(null);
        }}
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
