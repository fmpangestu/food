"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Select/deselect semua user
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const openDeleteConfirmation = () => {
    if (selectedUsers.length === 0) return;
    setIsAlertOpen(true);
  };

  // Confirm delete multiple users
  const confirmDelete = async () => {
    setIsDeleting(true);

    // Delete setiap user yang dipilih
    for (const userId of selectedUsers) {
      await handleDelete(userId);
    }

    setIsDeleting(false);
    setSelectedUsers([]);
    setIsAlertOpen(false);
  };
  const isAllSelected =
    selectedUsers.length === users.length && users.length > 0;
  const isSomeSelected = selectedUsers.length > 0;
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold mb-2">Data User</h2>
        {isSomeSelected && (
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={openDeleteConfirmation}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Terpilih ({selectedUsers.length})
          </Button>
        )}
      </div>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-start w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
                className="h-4 w-4"
              />
            </th>
            <th className="border px-2 py-1 text-start">Username</th>
            <th className="border px-2 py-1 text-start w-20">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user._id);
            return (
              <tr
                key={user._id}
                className={`group transition-colors ${
                  isSelected
                    ? "bg-blue-300 hover:bg-blue-400"
                    : "hover:bg-gray-300"
                }`}
              >
                <td className="border px-2 py-1">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleUserSelection(user._id)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="border px-2 py-1">{user.username}</td>
                <td className="border px-2 py-1">
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setSelectedUsers([user._id]);
                      openDeleteConfirmation();
                    }}
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* AlertDialog konfirmasi hapus */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedUsers.length} user yang
              dipilih?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setSelectedUsers([])}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting
                ? "Menghapus..."
                : `Hapus ${selectedUsers.length} User`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
