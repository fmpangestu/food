"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface UserListProps {
  users: User[];
  handleDelete: (id: string) => void;
}

export default function UserList({ users, handleDelete }: UserListProps) {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteConfirmation = (userId: string) => {
    setUserToDelete(userId);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    await handleDelete(userToDelete);
    setIsDeleting(false);
    setUserToDelete(null);
    setIsAlertOpen(false);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Data User</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-start">Username</th>
            <th className="border px-2 py-1 text-start">Action</th>
          </tr>
        </thead>
        <tbody className="">
          {users.map((user) => (
            <tr key={user._id} className="group">
              <td className="border px-2 py-1 group-hover:bg-gray-300">
                {user.username}
              </td>
              <td className=" px-2 py-1 group-hover:bg-gray-300">
                <Button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => openDeleteConfirmation(user._id)}
                >
                  <Trash2 className="inline h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AlertDialog konfirmasi hapus */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user ini?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
