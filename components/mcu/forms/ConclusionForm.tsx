"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { X, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

export const ConclusionForm = () => {
  const { control } = useFormContext();
  
  const [saranOptions, setSaranOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaran = async () => {
      try {
        const response = await fetch('/api/mcu/saran');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSaranOptions(data);
      } catch (error) {
        console.error("Gagal mengambil data saran:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaran();
  }, []);

  const handleAddNewSaran = async (newSaran: string) => {
    if (!saranOptions.includes(newSaran)) {
      setSaranOptions((prev) => [newSaran, ...prev]);
    }

    try {
      await fetch('/api/mcu/saran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newSaran }),
      });
    } catch (error) {
      console.error("Gagal menyimpan saran baru:", error);
      setSaranOptions((prev) => prev.filter(s => s !== newSaran));
    }
  };

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
                  onValueage={field.onChange}
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
                  onAddNewOption={handleAddNewSaran}
                  isLoading={isLoading} 
                />
              </FormItem>
            )}
          />
        </div>

        <div>
          <SignatureField
            nameFieldName="conclusionValidatorName"
            qrFieldName="conclusionValidatorQr"
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
  onAddNewOption: (value: string) => void;
  isLoading: boolean;
}

function MultiSelectCombobox({
  options,
  selected,
  onChange,
  onAddNewOption,
  isLoading,
}: MultiSelectComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // BARU: State & Konstanta untuk fitur "Show More"
  const [showAllOptions, setShowAllOptions] = useState(false);
  const ITEM_LIMIT = 5;

  const handleSelect = (value: string) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
  };

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
  };

  const handleEditStart = (index: number, text: string) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const newSelected = [...selected];
    const originalText = newSelected[editingIndex];
    const newText = editText.trim();
    if (newText && newText !== originalText) {
      newSelected[editingIndex] = newText;
      onChange(newSelected);
      onAddNewOption(newText);
    }
    setEditingIndex(null);
    setEditText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (!input) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      if (input.value === "" && selected.length > 0) {
        handleUnselect(selected[selected.length - 1]);
      }
    }
    if (e.key === "Escape") input.blur();
    if (e.key === "Enter") {
      e.preventDefault();
      const newSaran = inputValue.trim();
      if (newSaran && !selected.includes(newSaran)) {
        onAddNewOption(newSaran);
        onChange([...selected, newSaran]);
        setInputValue("");
      }
    }
  };

  const filteredOptions = options;

  // BARU: Logika untuk memotong daftar dropdown
  const optionsToShow = showAllOptions || inputValue
    ? filteredOptions
    : filteredOptions.slice(0, ITEM_LIMIT);

  return (
    <Popover 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // BARU: Reset "Show More" setiap kali dropdown ditutup
        if (!isOpen) {
          setShowAllOptions(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        {/* MODIFIKASI: Mengubah layout container utama */}
        <div className="flex items-start justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-[40px]">
          {/* MODIFIKASI: Mengubah layout badge menjadi vertikal */}
          <div className="flex flex-col gap-2">
            {selected.map((item, index) => (
              <Badge key={item + index} variant="secondary" className="max-w-xs">
                {editingIndex === index ? (
                  <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={handleEditSave} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleEditSave(); } if (e.key === "Escape") { e.preventDefault(); setEditingIndex(null); } }} className="bg-transparent outline-none p-0 m-0 w-full" autoFocus />
                ) : (
                  <>
                    <span className="truncate min-w-0" title={item} onDoubleClick={() => handleEditStart(index, item)}>{item}</span>
                    <button className="ml-1 flex-shrink-0 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2" onClick={() => handleUnselect(item)}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </>
                )}
              </Badge>
            ))}
            {/* BARU: Input untuk saran baru diletakkan di bawah badge */}
            <input
              ref={inputRef}
              type="text"
              placeholder={selected.length > 0 ? "Ketik saran baru..." : "Pilih atau ketik saran baru..."}
              className="bg-transparent outline-none placeholder:text-muted-foreground text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                // Hanya Enter yang ditangani di sini
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newSaran = inputValue.trim();
                  if (newSaran && !selected.includes(newSaran)) {
                    onAddNewOption(newSaran);
                    onChange([...selected, newSaran]);
                    setInputValue("");
                  }
                }
              }}
              onClick={() => setOpen(true)} // Buka dropdown saat input diklik
            />
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 cursor-pointer" onClick={() => setOpen(prev => !prev)} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command onKeyDown={handleKeyDown}>
          {/* Input pencarian di dalam dropdown bisa disembunyikan jika tidak perlu */}
          <CommandInput placeholder="Cari saran..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Memuat..." : "Saran tidak ditemukan."}
            </CommandEmpty>
            <CommandGroup>
              {optionsToShow.map((option) => (
                <CommandItem key={option} onSelect={() => { handleSelect(option); setInputValue(""); }} className="truncate" title={option}>
                  {option}
                </CommandItem>
              ))}
              {/* BARU: Render tombol "Show More" */}
              {!showAllOptions && !inputValue && filteredOptions.length > ITEM_LIMIT && (
                <CommandItem
                  onSelect={(e) => {
                    setShowAllOptions(true);
                  }}
                  className="text-center justify-center text-muted-foreground cursor-pointer"
                >
                  Tampilkan {filteredOptions.length - ITEM_LIMIT} lainnya...
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}