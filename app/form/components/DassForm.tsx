"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const allDassQuestions = [
  {
    id: "dass1",
    text: "Saya merasa sulit untuk menenangkan diri.",
    scale: "s",
  },
  { id: "dass2", text: "Saya menyadari mulut saya kering.", scale: "a" },
  {
    id: "dass3",
    text: "Saya sepertinya tidak bisa merasakan perasaan positif sama sekali.",
    scale: "d",
  },
  {
    id: "dass4",
    text: "Saya mengalami kesulitan bernapas (misalnya, napas yang sangat cepat, sesak napas saat tidak melakukan aktivitas fisik).",
    scale: "a",
  },
  {
    id: "dass5",
    text: "Saya merasa sulit untuk berinisiatif melakukan sesuatu.",
    scale: "d",
  },
  {
    id: "dass6",
    text: "Saya cenderung bereaksi berlebihan terhadap situasi.",
    scale: "s",
  },
  {
    id: "dass7",
    text: "Saya mengalami gemetar (misalnya pada tangan).",
    scale: "a",
  },
  {
    id: "dass8",
    text: "Saya merasa bahwa saya menggunakan banyak energi saraf.",
    scale: "s",
  },
  {
    id: "dass9",
    text: "Saya khawatir tentang situasi di mana saya mungkin panik dan mempermalukan diri sendiri.",
    scale: "a",
  },
  {
    id: "dass10",
    text: "Saya merasa bahwa saya tidak memiliki apa pun untuk dinantikan.",
    scale: "d",
  },
  { id: "dass11", text: "Saya merasa gelisah.", scale: "s" },
  { id: "dass12", text: "Saya merasa sulit untuk rileks.", scale: "s" },
  { id: "dass13", text: "Saya merasa sedih dan murung.", scale: "d" },
  {
    id: "dass14",
    text: "Saya tidak toleran terhadap apa pun yang menghalangi saya untuk melanjutkan apa yang saya lakukan.",
    scale: "s",
  },
  { id: "dass15", text: "Saya merasa hampir panik.", scale: "a" },
  {
    id: "dass16",
    text: "Saya tidak dapat menjadi antusias terhadap apa pun.",
    scale: "d",
  },
  {
    id: "dass17",
    text: "Saya merasa tidak berharga sebagai pribadi.",
    scale: "d",
  },
  { id: "dass18", text: "Saya merasa agak sensitif.", scale: "s" },
  {
    id: "dass19",
    text: "Saya menyadari aksi jantung saya tanpa aktivitas fisik (misalnya, merasakan peningkatan detak jantung, jantung berhenti berdetak).",
    scale: "a",
  },
  {
    id: "dass20",
    text: "Saya merasa takut tanpa alasan yang jelas.",
    scale: "a",
  },
  { id: "dass21", text: "Saya merasa hidup tidak berarti.", scale: "d" },
];

const answerOptions = [
  { value: "0", label: "Tidak berlaku untuk saya sama sekali" },
  {
    value: "1",
    label: "Diterapkan pada saya sampai tingkat tertentu, atau beberapa waktu",
  },
  {
    value: "2",
    label:
      "Diterapkan pada saya dalam tingkat yang cukup besar atau sebagian besar waktu",
  },
  {
    value: "3",
    label: "Berlaku sangat banyak atau sebagian besar waktu bagi saya",
  },
];

const schemaObject = Object.fromEntries(
  allDassQuestions.map((q) => [
    q.id,
    z.string().min(1, "Harap pilih salah satu jawaban."),
  ])
);
const dassFormSchema = z.object(schemaObject);

export type DassFormValues = z.infer<typeof dassFormSchema>;

type DassFormProps = {
  onNext: (data: DassFormValues) => void;
  onBack: () => void;
  defaultValues: any;
};

export const DassForm = ({ onNext, onBack, defaultValues }: DassFormProps) => {
  const form = useForm<DassFormValues>({
    resolver: zodResolver(dassFormSchema),
    defaultValues,
  });

  const onSubmit = (data: DassFormValues) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 animate-fade-in"
      >
        <div>
          <p className="text-sm text-gray-600">
            Pilih salah satu jawaban yang paling sesuai dengan kondisi Anda
            selama seminggu terakhir.
          </p>
          <div className="mt-4 text-xs text-gray-500 border rounded-lg p-3 bg-gray-50">
            <b>Keterangan:</b>
            <ul className="list-disc list-inside grid grid-cols-2 sm:grid-cols-4 gap-x-4">
              {answerOptions.map((opt) => (
                <li key={opt.value}>
                  <b>{opt.value}</b> = {opt.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          {allDassQuestions.map((q, index) => (
            <FormField
              key={q.id}
              control={form.control}
              name={q.id as keyof DassFormValues}
              render={({ field }) => (
                // --- PERUBAHAN UTAMA DI SINI ---
                <FormItem className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 shadow-sm">
                  <FormLabel className="text-base mb-4 sm:mb-0 sm:pr-4">
                    {index + 1}. {q.text}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      // Layout dibuat fleksibel dan simetris
                      className="flex items-center justify-around sm:justify-between w-full sm:w-[240px] flex-shrink-0"
                    >
                      {answerOptions.map((opt) => (
                        <FormItem
                          key={opt.value}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <RadioGroupItem value={opt.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {opt.value}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="w-full sm:w-auto text-right mt-2 sm:mt-0" />
                </FormItem>
              )}
            />
          ))}
        </div>

        <CardFooter className="px-0 pt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button
            type="submit"
            className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
          >
            Lanjutkan
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
