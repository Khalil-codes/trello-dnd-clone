"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskStore } from "@/store/board";
import { Plus } from "lucide-react";
import React, { FormEvent, useRef } from "react";
import { toast } from "sonner";

const NewTaskButton = () => {
  const add = useTaskStore((state) => state.addTask);
  const ref = useRef<HTMLButtonElement>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);

    const title = formData.get("title") as string;

    add(title);

    form.reset();
    ref.current?.click();
    toast.success("Task added");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={ref}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new task</DialogTitle>
          <DialogDescription>What do you want to add?</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Groceries" required />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="sm">
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskButton;
