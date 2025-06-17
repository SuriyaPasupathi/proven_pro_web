import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-red-200/50 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/5 to-red-100/5 pointer-events-none"></div>
        <DialogHeader className="space-y-4 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              {title}
            </DialogTitle>
          </div>
          <div className="h-0.5 w-full bg-gradient-to-r from-red-200/20 via-red-300/20 to-red-200/20 rounded-full"></div>
        </DialogHeader>
        <div className="py-4 px-1">
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
        </div>
        <DialogFooter className="gap-3 pt-3 border-t border-red-100/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-red-200/50 text-red-600 hover:bg-red-50/50 hover:border-red-300/50 transition-all duration-300 rounded-xl h-9"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl h-9"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog; 