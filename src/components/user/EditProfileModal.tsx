import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parseISO } from "date-fns";
interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name?: string;
    birthDate?: string;
  };
}

export default function EditProfileModal({
  open,
  onClose,
  user,
}: EditProfileModalProps) {
  const { update } = useSession();
  const [username, setUsername] = useState(user?.name || "");
  //   const [birthDate, setBirthDate] = useState(user?.birthDate || "");
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    user?.birthDate ? parseISO(user.birthDate) : undefined
  );
  const handleSave = async () => {
    // Panggil API update profile user (POST/PUT ke /api/users atau /api/profile)
    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, birthDate }),
    });
    await update();
    onClose();
    // Optional: reload session/user data
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50">
      <div className=" bg-white rounded-lg p-6 w-[90vw] max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Profil</h2>
        <label className="block mb-2 text-sm">Username</label>
        <input
          className="border rounded px-2 py-1 w-full mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="block mb-2 text-sm">Tanggal Lahir</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!birthDate}
              className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal mb-4"
              type="button"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? (
                format(birthDate, "PPP")
              ) : (
                <span>Pilih tanggal lahir</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              captionLayout="dropdown"
              fromYear={1950}
              toYear={new Date().getFullYear()}
              required
            />
          </PopoverContent>
        </Popover>
        <div className="flex min-w-full justify-end gap-2 ">
          <button
            className="px-3 py-1 w-full rounded bg-gray-200"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="px-3 py-1 w-full rounded bg-blue-600 text-white"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
