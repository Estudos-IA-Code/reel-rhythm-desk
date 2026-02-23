import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MoviePaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  onPaginar: (pagina: number) => void;
}

const MoviePagination = ({
  paginaAtual,
  totalPaginas,
  onPaginar,
}: MoviePaginationProps) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
        disabled={paginaAtual <= 1}
        onClick={() => onPaginar(paginaAtual - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === paginaAtual ? "default" : "outline"}
          size="icon"
          className={
            page === paginaAtual
              ? "h-9 w-9 gradient-gold text-primary-foreground border-0"
              : "h-9 w-9 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }
          onClick={() => onPaginar(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
        disabled={paginaAtual >= totalPaginas}
        onClick={() => onPaginar(paginaAtual + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MoviePagination;
