import { Film, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieEmptyStateProps {
  onAbrirCriar: () => void;
}

const MovieEmptyState = ({ onAbrirCriar }: MovieEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Film className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="font-display text-2xl tracking-wider text-foreground mb-2">
        NENHUM FILME ENCONTRADO
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Adicione um novo filme à sua lista ou ajuste os filtros de busca.
      </p>
      <Button
        onClick={onAbrirCriar}
        className="gap-2 gradient-gold text-primary-foreground hover:opacity-90 border-0 font-body font-semibold"
      >
        <Plus className="h-4 w-4" />
        Adicionar Filme
      </Button>
    </div>
  );
};

export default MovieEmptyState;
