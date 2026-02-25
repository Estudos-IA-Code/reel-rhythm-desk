import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Movie } from "@/types/movie";

type MovieRow = {
  id: string;
  user_id: string;
  titulo: string;
  categorias: string[];
  ano: number | null;
  poster_url: string | null;
  assistido: boolean;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
};

const toMovie = (row: MovieRow): Movie => ({
  id: row.id,
  titulo: row.titulo,
  categorias: row.categorias,
  ano: row.ano ?? undefined,
  posterUrl: row.poster_url ?? undefined,
  assistido: row.assistido,
  observacoes: row.observacoes ?? undefined,
});

export const useMovies = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: movies = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["movies", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as MovieRow[]).map(toMovie);
    },
    enabled: !!user,
  });

  const createMovie = useMutation({
    mutationFn: async (payload: Omit<Movie, "id" | "assistido">) => {
      const { error } = await supabase.from("movies").insert({
        user_id: user!.id,
        titulo: payload.titulo,
        categorias: payload.categorias,
        ano: payload.ano ?? null,
        poster_url: payload.posterUrl ?? null,
        observacoes: payload.observacoes ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  const updateMovie = useMutation({
    mutationFn: async ({ id, ...payload }: Omit<Movie, "assistido"> & { id: string }) => {
      const { error } = await supabase
        .from("movies")
        .update({
          titulo: payload.titulo,
          categorias: payload.categorias,
          ano: payload.ano ?? null,
          poster_url: payload.posterUrl ?? null,
          observacoes: payload.observacoes ?? null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  const toggleAssistido = useMutation({
    mutationFn: async ({ id, assistido }: { id: string; assistido: boolean }) => {
      const { error } = await supabase
        .from("movies")
        .update({ assistido })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  const deleteMovie = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("movies")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  return {
    movies,
    isLoading,
    isError,
    refetch,
    createMovie,
    updateMovie,
    toggleAssistido,
    deleteMovie,
  };
};
