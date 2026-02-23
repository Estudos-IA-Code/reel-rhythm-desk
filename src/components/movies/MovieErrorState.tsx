import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieErrorStateProps {
  mensagem?: string;
  onRetry: () => void;
}

const MovieErrorState = ({
  mensagem = "Não foi possível carregar os filmes.",
  onRetry,
}: MovieErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 mb-4">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <p className="text-foreground font-medium mb-2">{mensagem}</p>
      <Button
        variant="outline"
        onClick={onRetry}
        className="gap-2 border-border text-foreground hover:bg-muted mt-2"
      >
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  );
};

export default MovieErrorState;
