import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  movieTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({
  open,
  movieTitle,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent className="bg-card border-border text-card-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl tracking-wider text-foreground">
            EXCLUIR FILME
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-foreground">{movieTitle}</span>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-muted-foreground hover:text-foreground hover:bg-muted">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
