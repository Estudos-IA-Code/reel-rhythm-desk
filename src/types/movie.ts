export interface Movie {
  id: string;
  titulo: string;
  categorias: string[];
  ano?: number;
  posterUrl?: string;
  assistido: boolean;
  observacoes?: string;
}

export interface MovieFilters {
  busca: string;
  categorias: string[];
}

export interface Pagination {
  paginaAtual: number;
  totalPaginas: number;
}
