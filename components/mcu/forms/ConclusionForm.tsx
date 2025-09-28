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
import { Textarea } from "@/components/ui/textarea";

export const ConclusionForm = () => {
  const { control } = useFormContext();

  const [saranOptions, setSaranOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaran = async () => {
      try {
        const response = await fetch("/api/mcu/saran");
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
      await fetch("/api/mcu/saran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newSaran }),
      });
    } catch (error) {
      console.error("Gagal menyimpan saran baru:", error);
      setSaranOptions((prev) => prev.filter((s) => s !== newSaran));
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
      textarea.select();
    }
  }, [editingIndex]);

  const handleSelect = (value: string) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setInputValue("");
    inputRef.current?.focus();
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newSaran = inputValue.trim();
      if (newSaran && !selected.includes(newSaran)) {
        onAddNewOption(newSaran);
        onChange([...selected, newSaran]);
        setInputValue("");
      }
    }
    if (e.key === "Backspace" && inputValue === "") {
      if (selected.length > 0) {
        handleUnselect(selected[selected.length - 1]);
      }
    }
  };

  const [showAllOptions, setShowAllOptions] = useState(false);
  const ITEM_LIMIT = 5;
  const filteredOptions = options;
  const optionsToShow =
    showAllOptions || inputValue
      ? filteredOptions
      : filteredOptions.slice(0, ITEM_LIMIT);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setShowAllOptions(false);
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex items-start justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-[40px]">
          <div className="flex flex-col gap-2 w-full mr-2">
            {selected.map((item, index) =>
              editingIndex === index ? (
                <Textarea
                  key={`editing-${index}`}
                  ref={textareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleEditSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEditSave();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setEditingIndex(null);
                    }
                  }}
                  className="bg-secondary outline-none p-1 w-full resize-none border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-sm leading-tight rounded-md"
                  rows={1}
                />
              ) : (
                <Badge
                  key={item + index}
                  variant="secondary"
                  className="flex h-auto max-w-full items-start justify-between whitespace-normal text-left"
                >
                  <span
                    className="min-w-0 break-words py-0.5 pr-2"
                    onDoubleClick={() => handleEditStart(index, item)}
                  >
                    {item}
                  </span>
                  <button
                    className="flex-shrink-0"
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              )
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder={
                selected.length > 0
                  ? "Ketik atau pilih saran baru..."
                  : "Pilih atau ketik saran baru..."
              }
              className="bg-transparent outline-none placeholder:text-muted-foreground text-sm h-5"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!open) setOpen(true);
              }}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setOpen(true)}
            />
          </div>
          <button onClick={() => setOpen((prev) => !prev)} className="mt-1">
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 cursor-pointer" />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder="Cari saran..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Memuat..." : "Saran tidak ditemukan."}
            </CommandEmpty>
            <CommandGroup>
              {optionsToShow.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => handleSelect(option)}
                  className="truncate"
                  title={option}
                >
                  {option}
                </CommandItem>
              ))}
              {!showAllOptions &&
                !inputValue &&
                filteredOptions.length > ITEM_LIMIT && (
                  <CommandItem
                    onSelect={() => setShowAllOptions(true)}
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
