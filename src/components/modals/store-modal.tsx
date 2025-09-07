import * as z from "zod"

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { Modal } from "@/components/custom-ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCStore } from "@/context/store-provider";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const createStore = api.store.create.useMutation({
    onSuccess: ([store]) => {
      if (!store?.id) return;
      toast.success("Store created successfully");
      window.location.replace(`/dashboard/${store.id}`);
    },
    onError: (error) => {
      toast.error("Error", {
        description: error.message,
        duration: 5000,
        style: {
          color: '#ff0000',
          backgroundColor: '#fff',
        },
      })
    }
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await createStore.mutateAsync(values.name)
      .finally(() => {
        setLoading(false)
        onClose();
      });
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field  }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="E-Commerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
