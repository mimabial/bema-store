import {useState} from "react";

import {
  AlertDialog,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import {Button} from "@/components/ui/button";
import {LoadingButton} from "@/components/custom-ui/loading-button";
import {Trash} from "lucide-react";
import {useCartActions} from "@/hooks/use-cart-actions";
import {useCart} from "@/context/cart-provider";

export const ClearCartConfirmation = () => {
  const [open, setOpen] = useState(false);
  const {clearCart} = useCartActions();
  const {toggleCart} = useCart();
  const handleClearCart = async () => {
    clearCart();
    setOpen(false);
    toggleCart();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        asChild
      >
        <Button
          onClick={() => toggleCart()}
          className="rounded-md w-8 h-8"
          variant="outline"
          size="icon"
        >
          <Trash
            className="h-4 w-4 transition-transform ease-in-out duration-700"
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            All items will be removed from your cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => setOpen(false)}>
            No
          </Button>
          <LoadingButton onClick={handleClearCart}>
            Yes
          </LoadingButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
