import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface MovieFiltersProps {
  busca: string;
  categoriasSelecionadas: string[];
  categoriasDisponiveis: string[];
  onBuscarChange: (valor: string) => void;
  onCategoriasChange: (categorias: string[]) => void;
}

const MovieFilters = ({
  busca,
  categoriasSelecionadas,
  categoriasDisponiveis,
  onBuscarChange,
  onCategoriasChange,
}: MovieFiltersProps) => {
  const toggleCategoria = (cat: string) => {
    if (categoriasSelecionadas.includes(cat)) {
      onCategoriasChange(categoriasSelecionadas.filter((c) => c !== cat));
    } else {
      onCategoriasChange([...categoriasSelecionadas, cat]);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar filme por nome..."
          value={busca}
          onChange={(e) => onBuscarChange(e.target.value)}
          className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted min-w-[180px] justify-between">
            <span>
              {categoriasSelecionadas.length > 0
                ? `${categoriasSelecionadas.length} categoria(s)`
                : "Categorias"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 bg-popover border-border z-50 p-2" align="end">
          <div className="space-y-1">
            {categoriasDisponiveis.map((cat) => (
              <label
                key={cat}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Checkbox
                  checked={categoriasSelecionadas.includes(cat)}
                  onCheckedChange={() => toggleCategoria(cat)}
                  className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                {cat}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {categoriasSelecionadas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categoriasSelecionadas.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="gap-1 bg-primary/15 text-primary border-0 cursor-pointer hover:bg-primary/25"
              onClick={() => toggleCategoria(cat)}
            >
              {cat}
              <X className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieFilters;
