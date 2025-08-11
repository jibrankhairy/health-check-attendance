"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatientForm, type PatientFormValues } from "@/hooks/usePatientForm";
import { mcuPackages, addOnItems } from "@/lib/mcu-data";

type PatientToEdit = Omit<PatientFormValues, "selectedPackage" | "addOns"> & {
  id: number;
  mcuPackage: any;
  nik: string;
};

type PatientFormProps = {
  setOpen: (open: boolean) => void;
  companyId: string;
  onPatientAdded: () => void;
  patientToEdit?: PatientToEdit | null;
};

const PackageCard = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "border-2 rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ease-in-out transform hover:-translate-y-1",
      isSelected
        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300"
        : "border-gray-200 bg-white hover:border-blue-400"
    )}
  >
    <h3
      className={cn(
        "font-semibold",
        isSelected ? "text-blue-800" : "text-gray-700"
      )}
    >
      {label}
    </h3>
  </div>
);

export const PatientRegistrationForm = (props: PatientFormProps) => {
  const { form, onSubmit, handleDobChange, selectedPackageDetails } =
    usePatientForm(props);
  const { patientToEdit } = props;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[80vh] overflow-y-auto pr-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Pasien</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan NIK Karyawan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="cth: Budi Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Pasien (Opsional)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Untuk mengirim QR Code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input type="date" {...field} onChange={handleDobChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Umur</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posisi / Jabatan</FormLabel>
                <FormControl>
                  <Input placeholder="cth: Staff" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="division"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Divisi</FormLabel>
                <FormControl>
                  <Input placeholder="cth: Human Resources" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Karyawan</FormLabel>
                <FormControl>
                  <Input placeholder="cth: Karyawan Tetap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi Kerja</FormLabel>
              <FormControl>
                <Input placeholder="cth: Jakarta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="selectedPackage"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">Pilih Paket MCU</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {mcuPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      label={pkg.label}
                      isSelected={field.value === pkg.id}
                      onClick={() => field.onChange(pkg.id)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedPackageDetails.length > 0 && (
          <div className="p-4 bg-gray-50 border rounded-md">
            <h4 className="font-semibold mb-2 text-gray-800">
              Rincian Paket Terpilih:
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {selectedPackageDetails.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <FormField
          control={form.control}
          name="addOns"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Pemeriksaan Tambahan (Add-on)
                </FormLabel>
                <FormDescription>
                  Pilih item jika ada pemeriksaan tambahan di luar paket.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {addOnItems.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="addOns"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...(field.value || []),
                                    item.id,
                                  ])
                                : field.onChange(
                                    (field.value || []).filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4 sticky bottom-0 bg-white pb-2 -mb-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => props.setOpen(false)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            {patientToEdit ? "Simpan Perubahan" : "Simpan & Buat QR Code"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
