import { Plus, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeaderProps {
  onAbrirCriar: () => void;
}

const MovieHeader = ({ onAbrirCriar }: MovieHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
          <Film className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-4xl text-foreground tracking-wider">MEUS FILMES</h1>
      </div>
      <Button onClick={onAbrirCriar} className="gap-2 gradient-gold text-primary-foreground hover:opacity-90 border-0 font-body font-semibold">
        <Plus className="h-4 w-4" />
        Adicionar Filme
      </Button>
    </div>
  );
};

export default MovieHeader;
