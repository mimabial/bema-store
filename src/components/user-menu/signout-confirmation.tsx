import {useState} from "react";
import {logout} from "@/server/auth/actions";
import {toast} from "sonner";
import {TriangleAlert} from "@/components/icons";
import {
    AlertDialog,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {APP_TITLE} from "@/lib/constants";
import {Button} from "@/components/ui/button";
import {LoadingButton} from "@/components/custom-ui/loading-button";
import {cn} from "@/lib/utils";
import {LogOut} from "lucide-react";
import {Openings} from "@/context/user-menu-provider";
import {useCartActions} from "@/hooks/use-cart-actions";

type SignoutConfirmationProps = {
    isOpen: Openings;
    user: boolean;
}

export const SignoutConfirmation = ({isOpen, user}: SignoutConfirmationProps) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {clearCart} = useCartActions();
    const handleSignout = async () => {
        setIsLoading(true);
        try {
            await logout();
            // clearCart();
            toast("Signed out successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast(error.message, {
                    icon: (
                        <TriangleAlert className="h-4 w-4 text-destructive"/>
                    ),
                });
            }
        } finally {
            setOpen(false);
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                asChild
            >
                <Button
                  variant="ghost"
                  className={`w-full h-10 mb-1 ${isOpen === Openings.True ? "justify-start" : "justify-center"}`}
                >
                    <span className={cn(isOpen === Openings.False ? "" : "mr-4")}>
                      <LogOut size={18}/>
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === Openings.False ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                        {user
                          ? "Logout"
                          : "Login"}
                    </p>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xs">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        Sign out from {APP_TITLE}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be redirected to the home page.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <LoadingButton loading={isLoading} onClick={handleSignout}>
                        Continue
                    </LoadingButton>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
