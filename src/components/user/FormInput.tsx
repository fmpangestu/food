/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SmilePlusIcon, Sparkles, UploadCloud } from "lucide-react";

interface FormData {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
}

interface FormFoodInputProps {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  saving?: boolean;
  loading?: boolean; // Tambahan: untuk menampilkan status loading
  showSave?: boolean; // Tambahan: tampilkan tombol simpan jika true
  onSave?: () => void; // Tambahan: handler simpan data pribadi
}

const FormFoodInput: React.FC<FormFoodInputProps> = ({
  formData,
  onChange,
  onSubmit,
  error,
  saving,
  loading,
  showSave,
  onSave,
}) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="block mb-2" htmlFor="weight">
          Berat Badan (kg)
        </Label>
        <Input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={onChange}
          className="text-[#0d1821] bg-white outline-none rounded-sm p-2 w-full"
          required
        />
      </div>
      <div>
        <Label className="block mb-2" htmlFor="height">
          Tinggi Badan (cm)
        </Label>
        <Input
          type="number"
          id="height"
          name="height"
          value={formData.height}
          onChange={onChange}
          className="text-[#0d1821] bg-white outline-none rounded-sm p-2 w-full"
          required
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="block mb-2" htmlFor="age">
          Usia (tahun)
        </Label>
        <Input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={onChange}
          className="text-[#0d1821] bg-white outline-none rounded-sm p-2 w-full"
          required
        />
      </div>
      <div>
        <Label className="block mb-2" htmlFor="gender">
          Jenis Kelamin
        </Label>
        <Select
          value={formData.gender}
          onValueChange={(value) =>
            onChange({ target: { name: "gender", value } } as any)
          }
        >
          <SelectTrigger className="w-full text-[#0d1821] bg-white  p-2 rounded-sm">
            <SelectValue placeholder="Pilih jenis kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="male">Laki-laki</SelectItem>
              <SelectItem value="female">Perempuan</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div
      className={` ${
        showSave ? "md:grid" : "block"
      }  grid-cols-2 w-full gap-2 justify-center items-center`}
    >
      <div className="w-full">
        <Label className="block mb-2" htmlFor="activityLevel">
          Tingkat Aktivitas
        </Label>
        <Select
          value={formData.activityLevel}
          onValueChange={(value) =>
            onChange({ target: { name: "activityLevel", value } } as any)
          }
        >
          <SelectTrigger className=" text-[#0d1821] bg-white  p-2 rounded-sm">
            <SelectValue placeholder="Tingkat aktivitas" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="sedentary">
                Sangat Rendah (Hampir tidak pernah berolahraga atau sangat minim
                aktivitas fisik, misal: duduk di kantor/sekolah, aktivitas
                harian ringan di rumah)
              </SelectItem>
              <SelectItem value="light">
                Ringan (Olahraga ringan 1-3 hari/minggu, misal: jalan kaki
                santai, naik turun tangga, bersepeda santai)
              </SelectItem>
              <SelectItem value="moderate">
                Sedang (Olahraga sedang 3-5 hari/minggu, misal: jogging, senam
                aerobik, bersepeda sedang)
              </SelectItem>
              <SelectItem value="active">
                Tinggi (Olahraga berat 6-7 hari/minggu atau pekerjaan fisik
                berat, misal: olahraga kompetitif, pekerja lapangan, buruh
                angkut)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {showSave && (
        <button
          type="button"
          className={`relative flex group justify-center items-center text-center w-full bg-neutral-100/10 border-t border-l border-neutral-400/10 shadow-[3px_3px_3px_rgba(0,0,0,0.089)]    font-semibold text-white py-[5px] mt-[22px] px-4 rounded overflow-hidden transition-all duration-500 ease-in-out`}
          onClick={onSave}
          disabled={saving}
        >
          <UploadCloud
            className={` absolute  group-hover:-translate-y-10 -translate-x-16 h-4 w-4 transition-all text-white duration-1000 ease-in-out mr-5`}
          />
          <SmilePlusIcon className="absolute translate-y-10 group-hover:translate-y-0 -translate-x-16 h-4 w-4 transition-all text-white duration-1000 ease-in-out mr-5" />
          {saving ? "Menyimpan..." : "Simpan Data Mu"}
        </button>
      )}
    </div>
    {error && (
      <p className="absolute top-0 w-[80%] text-red-500 px-2 py-1 rounded-lg">
        {error}
      </p>
    )}
    <div className="flex gap-2">
      <button
        type="submit"
        className="flex justify-center items-center text-center bg-neutral-200/10  font-semibold w-full text-white py-2 px-4 rounded overflow-hidden relative border-l border-t border-neutral-400/10 shadow-[3px_3px_3px_rgba(0,0,0,0.089)] "
        disabled={loading}
      >
        {/* Sparkles normal: translate-y saat loading */}
        <Sparkles
          className={`inline mr-2 h-4 w-4 transition-all duration-500 ease-in-out
      absolute -translate-x-16
      ${loading ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"}
    `}
          style={{ zIndex: 2 }}
        />
        {/* Sparkles spin: scale out saat !loading */}
        <Sparkles
          className={`inline mr-2  h-4 w-4 transition-all duration-1000 ease-in-out
      ${loading ? "animate-spin  opacity-100" : "scale-0 opacity-0"}
    `}
          style={{ zIndex: 1 }}
        />
        <span className="inline-flex">
          {loading
            ? "Tunggu yaa...".split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block animate-bounce "
                  style={{
                    animationDelay: `${i * 0.09}s`,
                    opacity: 0,
                    animationFillMode: "forwards",
                    animationName: "fadeInBounce",
                  }} //animasi loading
                >
                  {char}
                </span>
              ))
            : "Mulai Perhitungan"}
        </span>
      </button>
    </div>
  </form>
);

export default FormFoodInput;
