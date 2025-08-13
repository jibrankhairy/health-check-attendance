// components/mcu/forms/ConclusionForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { X, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SignatureField } from "./SignatureField";

const saranOptions = [
  "Tidak ada saran tambahan.",
  "Rutin berolahraga minimal 30 menit setiap hari.",
  "Jaga pola makan seimbang, kurangi makanan berlemak dan tinggi gula.",
  "Lakukan pemeriksaan lanjutan ke dokter spesialis.",
  "Manajemen stres dengan baik dan istirahat yang cukup.",
  "Disarankan untuk berhenti merokok dan mengurangi konsumsi alkohol.",
];

export const ConclusionForm = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kesimpulan dan Rekomendasi Akhir</CardTitle>
        <CardDescription>
          Isi kesimpulan akhir kondisi pasien dan saran yang diberikan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="kesimpulan">Kondisi Pasien (Fit to Work)</Label>
          <FormField
            control={control}
            name="kesimpulan"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kesimpulan kondisi pasien" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="FIT TO WORK">Fit to Work</SelectItem>
                    <SelectItem value="FIT WITH NOTE">Fit with Note</SelectItem>
                    <SelectItem value="UNFIT TEMPORARY">
                      Unfit Temporary
                    </SelectItem>
                    <SelectItem value="UNFIT PERMANENTLY">
                      Unfit Permanently
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saran">
            Saran Tambahan (Bisa Pilih Banyak atau Ketik Baru)
          </Label>
          <FormField
            control={control}
            name="saran"
            render={({ field }) => (
              <FormItem>
                <MultiSelectCombobox
                  options={saranOptions}
                  selected={Array.isArray(field.value) ? field.value : []}
                  onChange={field.onChange}
                />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface MultiSelectComboboxProps {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}

function MultiSelectCombobox({
  options,
  selected,
  onChange,
}: MultiSelectComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (!input) return;

    if (e.key === "Delete" || e.key === "Backspace") {
      if (input.value === "" && selected.length > 0) {
        handleUnselect(selected[selected.length - 1]);
      }
    }

    if (e.key === "Escape") {
      input.blur();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const newSaran = inputValue.trim();

      if (newSaran && !selected.includes(newSaran)) {
        onChange([...selected, newSaran]);
        setInputValue("");
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-[40px]">
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUnselect(item);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput
            ref={inputRef}
            placeholder="Pilih atau ketik saran baru..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {inputValue
                ? `Tekan Enter untuk menambah "${inputValue}"`
                : "Ketik untuk mencari atau membuat saran baru."}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    handleSelect(option);
                    setInputValue("");
                  }}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-4 border-t mt-1">
          <SignatureField
            nameFieldName="conclusionValidatorName"
            qrFieldName="conclusionValidatorQr"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
