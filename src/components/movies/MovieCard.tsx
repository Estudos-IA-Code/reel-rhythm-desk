import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  index: number;
  onToggleAssistido: (id: string, valor: boolean) => void;
  onAbrirEditar: (id: string) => void;
  onSolicitarExcluir: (id: string) => void;
}

const MovieCard = ({
  movie,
  index,
  onToggleAssistido,
  onAbrirEditar,
  onSolicitarExcluir
}: MovieCardProps) => {
  return (
    <div
      className="group relative flex gap-4 rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}>

      {/* Poster */}
      <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {movie.posterUrl ?
        <img
          src={movie.posterUrl}
          alt={movie.titulo}
          className="h-full w-full object-cover"
          loading="lazy" /> :


        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Eye className="h-8 w-8 opacity-30" />
          </div>
        }
        {movie.assistido &&
        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <div className="rounded-full gradient-gold p-1.5">
              <Eye className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        }
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-body text-lg font-semibold text-foreground truncate">
              {movie.titulo}
            </h3>
            {movie.ano &&
            <span className="flex-shrink-0 text-sm text-muted-foreground">
                {movie.ano}
              </span>
            }
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {movie.categorias.map((cat) =>
            <Badge
              key={cat}
              variant="secondary"
              className="text-xs bg-secondary text-secondary-foreground border-0">

                {cat}
              </Badge>
            )}
          </div>

          {movie.observacoes &&
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {movie.observacoes}
            </p>
          }
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch
              checked={movie.assistido}
              onCheckedChange={(checked) =>
              onToggleAssistido(movie.id, checked)
              }
              className="data-[state=checked]:bg-primary" />

            <span className="text-sm text-muted-foreground flex items-center gap-1">
              {movie.assistido ?
              <>
                  <Eye className="h-3.5 w-3.5 text-primary" /> Assistido
                </> :

              <>
                  <EyeOff className="h-3.5 w-3.5" /> Não assistido
                </>
              }
            </span>
          </label>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => onAbrirEditar(movie.id)}>

              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onSolicitarExcluir(movie.id)}>

              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>);

};

export default MovieCard;