import { Plus, Film, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MovieHeaderProps {
  onAbrirCriar: () => void;
}

const MovieHeader = ({ onAbrirCriar }: MovieHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg gradient-gold items-center justify-center flex flex-row">
          <Film className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-4xl tracking-wider text-foreground">MEUS TOP FILMES 2</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/popular")}
          className="gap-2 border-border text-foreground hover:bg-muted font-body"
        >
          <Star className="h-4 w-4" />
          Populares
        </Button>
        <Button onClick={onAbrirCriar} className="gap-2 gradient-gold text-primary-foreground hover:opacity-90 border-0 font-body font-semibold">
          <Plus className="h-4 w-4" />
          Adicionar Filme
        </Button>
      </div>
    </div>
  );
};

export default MovieHeader;