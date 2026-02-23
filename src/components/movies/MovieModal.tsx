import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, X } from "lucide-react";
import type { Movie } from "@/types/movie";

interface MovieModalProps {
  open: boolean;
  onClose: () => void;
  onSalvar: (payload: Omit<Movie, "id" | "assistido">) => void;
  movie?: Movie | null;
  categoriasDisponiveis: string[];
}

const MovieModal = ({
  open,
  onClose,
  onSalvar,
  movie,
  categoriasDisponiveis,
}: MovieModalProps) => {
  const [titulo, setTitulo] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [ano, setAno] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (movie) {
      setTitulo(movie.titulo);
      setCategorias(movie.categorias);
      setAno(movie.ano?.toString() ?? "");
      setPosterUrl(movie.posterUrl ?? "");
      setObservacoes(movie.observacoes ?? "");
    } else {
      setTitulo("");
      setCategorias([]);
      setAno("");
      setPosterUrl("");
      setObservacoes("");
    }
  }, [movie, open]);

  const toggleCat = (cat: string) => {
    setCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    onSalvar({
      titulo: titulo.trim(),
      categorias,
      ano: ano ? parseInt(ano) : undefined,
      posterUrl: posterUrl.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
    });
  };

  const isEditing = !!movie;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border text-card-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wider">
            {isEditing ? "EDITAR FILME" : "NOVO FILME"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-foreground">Título *</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Nome do filme"
              required
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Categorias</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between border-border bg-secondary text-secondary-foreground hover:bg-muted"
                >
                  <span>
                    {categorias.length > 0
                      ? `${categorias.length} selecionada(s)`
                      : "Selecione"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-popover border-border z-50 p-2">
                {categoriasDisponiveis.map((cat) => (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      checked={categorias.includes(cat)}
                      onCheckedChange={() => toggleCat(cat)}
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    {cat}
                  </label>
                ))}
              </PopoverContent>
            </Popover>
            {categorias.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {categorias.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="gap-1 bg-primary/15 text-primary border-0 cursor-pointer hover:bg-primary/25"
                    onClick={() => toggleCat(cat)}
                  >
                    {cat}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ano" className="text-foreground">Ano</Label>
              <Input
                id="ano"
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                placeholder="2024"
                min={1888}
                max={2030}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poster" className="text-foreground">URL do Pôster</Label>
              <Input
                id="poster"
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs" className="text-foreground">Observações</Label>
            <Textarea
              id="obs"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Notas sobre o filme..."
              rows={3}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" className="gradient-gold text-primary-foreground hover:opacity-90 border-0 font-semibold">
              {isEditing ? "Salvar Alterações" : "Adicionar Filme"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
