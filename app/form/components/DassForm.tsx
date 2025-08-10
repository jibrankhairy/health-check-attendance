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
    text: "Sangatlah sulit bagi saya untuk beristirahat.",
    scale: "s",
  },
  {
    id: "dass2",
    text: "Saya menyadari bahwa mulut saya terasa kering.",
    scale: "a",
  },
  {
    id: "dass3",
    text: "Saya tidak pernah merasakan pengalaman mengenai perasaan yang positif.",
    scale: "d",
  },
  {
    id: "dass4",
    text: "Saya sangat sulit untuk bernapas (misalnya untuk menarik napas maupun kehilangan napas ketika melakukan aktivitas fisik).",
    scale: "a",
  },
  {
    id: "dass5",
    text: "Saya mengalami kesulitan untuk berinisiatif melakukan sesuatu hal.",
    scale: "d",
  },
  {
    id: "dass6",
    text: "Saya bereaksi secara berlebihan ketika menghadapi sesuatu hal.",
    scale: "s",
  },
  {
    id: "dass7",
    text: "Saya sering mengalami tremor (misalnya pada bagian tangan).",
    scale: "a",
  },
  {
    id: "dass8",
    text: "Saya merasa bahwa saya seringkali merasa cemas.",
    scale: "s",
  },
  {
    id: "dass9",
    text: "Saya sering merasa khawatir, yang membuat saya merasa panik dan terkadang kehilangan akal sehat.",
    scale: "a",
  },
  {
    id: "dass10",
    text: "Saya merasa psimis untuk menantikan sesuatu di masa depan.",
    scale: "d",
  },
  { id: "dass11", text: "Saya sering merasa gelisah.", scale: "s" },
  { id: "dass12", text: "Saya sulit untuk merasa relaks.", scale: "s" },
  { id: "dass13", text: "Saya sering merasa patah semangat.", scale: "d" },
  {
    id: "dass14",
    text: "Saya mudah terganggu dengan hal-hal yang menghalangi saya.",
    scale: "s",
  },
  { id: "dass15", text: "Saya mudah merasa panik.", scale: "a" },
  {
    id: "dass16",
    text: "Saya sulit untuk merasa bersemangat ketika melakukan sesuatu.",
    scale: "d",
  },
  {
    id: "dass17",
    text: "Saya merasa tidak berguna.",
    scale: "d",
  },
  { id: "dass18", text: "Saya merasa agak sensitif.", scale: "s" },
  {
    id: "dass19",
    text: "Jantung saya berdebar-debar sekalipun tidak melakukan aktivitas fisik apapun.",
    scale: "a",
  },
  {
    id: "dass20",
    text: "Saya sering merasa takut tanpa alasan yang jelas.",
    scale: "a",
  },
  {
    id: "dass21",
    text: "Saya merasa bahwa hidup ini tidak berarti.",
    scale: "d",
  },
];

const answerOptions = [
  { value: "0", label: "Tidak menggambarkan diri saya sama sekali." },
  {
    value: "1",
    label: "Kadang-kadang menggambarkan diri saya.",
  },
  {
    value: "2",
    label: "Seringkali menggambarkan diri saya.",
  },
  {
    value: "3",
    label: "Seluruhnya menggambarkan diri saya.",
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
