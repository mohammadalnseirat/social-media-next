"use client";

import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2Icon, OctagonAlert, Trash2Icon } from "lucide-react";

interface DeleteAlertModal {
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  title?: string;
  description?: string;
}

function DeleteAlertModal({
  isDeleting,
  onDelete,
  title = "Delete Post",
  description = "Are you sure you want to delete this post?",
}: DeleteAlertModal) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"} className="-mr-2">
          {isDeleting ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <Trash2Icon className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cyan-600 flex items-center gap-2">
            <OctagonAlert className="size-4 text-red-500" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                Deleting...
                <Loader2Icon className="size-4 animate-spin" />
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlertModal;
