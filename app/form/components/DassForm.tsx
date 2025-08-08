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
import { Separator } from "@/components/ui/separator";

const dassQuestions = {
  depression: [
    {
      id: "dass3",
      text: "Saya sepertinya tidak bisa merasakan perasaan positif sama sekali.",
    },
    {
      id: "dass5",
      text: "Saya merasa sulit untuk berinisiatif melakukan sesuatu.",
    },
    {
      id: "dass10",
      text: "Saya merasa tidak ada hal yang dapat saya harapkan di masa depan.",
    },
    { id: "dass13", text: "Saya merasa sedih dan tertekan." },
    { id: "dass16", text: "Saya tidak bisa antusias terhadap apapun." },
    { id: "dass17", text: "Saya merasa diri saya tidak berharga." },
    { id: "dass21", text: "Saya merasa hidup ini tidak berarti." },
  ],
  anxiety: [
    { id: "dass2", text: "Saya menyadari mulut saya terasa kering." },
    {
      id: "dass4",
      text: "Saya mengalami kesulitan bernapas (misalnya, napas cepat, sesak napas tanpa aktivitas fisik).",
    },
    { id: "dass7", text: "Saya mengalami gemetar (misalnya, di tangan)." },
    {
      id: "dass9",
      text: "Saya khawatir tentang situasi di mana saya mungkin panik dan mempermalukan diri sendiri.",
    },
    { id: "dass15", text: "Saya merasa hampir panik." },
    {
      id: "dass19",
      text: "Saya menyadari detak jantung saya tanpa aktivitas fisik (misalnya, peningkatan detak jantung, detak jantung tidak beraturan).",
    },
    { id: "dass20", text: "Saya merasa takut tanpa alasan yang jelas." },
  ],
  stress: [
    { id: "dass1", text: "Saya merasa sulit untuk menenangkan diri." },
    {
      id: "dass6",
      text: "Saya cenderung bereaksi berlebihan terhadap situasi.",
    },
    { id: "dass8", text: "Saya merasa menggunakan banyak energi saraf." },
    { id: "dass11", text: "Saya mendapati diri saya menjadi gelisah." },
    { id: "dass12", text: "Saya merasa sulit untuk bersantai." },
    {
      id: "dass14",
      text: "Saya tidak toleran terhadap apapun yang menghalangi saya melakukan apa yang sedang saya lakukan.",
    },
    {
      id: "dass18",
      text: "Saya merasa bahwa saya agak sensitif (mudah tersinggung).",
    },
  ],
};

const schemaObject = {
  ...Object.fromEntries(
    dassQuestions.depression.map((q) => [
      q.id,
      z.string().min(1, "Wajib diisi"),
    ])
  ),
  ...Object.fromEntries(
    dassQuestions.anxiety.map((q) => [q.id, z.string().min(1, "Wajib diisi")])
  ),
  ...Object.fromEntries(
    dassQuestions.stress.map((q) => [q.id, z.string().min(1, "Wajib diisi")])
  ),
};
const dassFormSchema = z.object(schemaObject);
type DassFormValues = z.infer<typeof dassFormSchema>;

export type DassResult = {
  dass_depression_score: number;
  dass_depression_level: string;
  dass_anxiety_score: number;
  dass_anxiety_level: string;
  dass_stress_score: number;
  dass_stress_level: string;
};

type DassFormProps = {
  onNext: (data: DassResult) => void;
  onBack: () => void;
};

const calculateDassScores = (data: DassFormValues): DassResult => {
  const getLevel = (score: number, type: "d" | "a" | "s"): string => {
    if (type === "d") {
      if (score <= 9) return "Normal";
      if (score <= 13) return "Ringan";
      if (score <= 20) return "Sedang";
      if (score <= 27) return "Parah";
      return "Sangat Parah";
    }
    if (type === "a") {
      if (score <= 7) return "Normal";
      if (score <= 9) return "Ringan";
      if (score <= 14) return "Sedang";
      if (score <= 19) return "Parah";
      return "Sangat Parah";
    }
    if (score <= 14) return "Normal";
    if (score <= 18) return "Ringan";
    if (score <= 25) return "Sedang";
    if (score <= 33) return "Parah";
    return "Sangat Parah";
  };
  const depressionScore =
    dassQuestions.depression.reduce(
      (sum, q) => sum + parseInt(data[q.id as keyof DassFormValues]),
      0
    ) * 2;
  const anxietyScore =
    dassQuestions.anxiety.reduce(
      (sum, q) => sum + parseInt(data[q.id as keyof DassFormValues]),
      0
    ) * 2;
  const stressScore =
    dassQuestions.stress.reduce(
      (sum, q) => sum + parseInt(data[q.id as keyof DassFormValues]),
      0
    ) * 2;
  return {
    dass_depression_score: depressionScore,
    dass_depression_level: getLevel(depressionScore, "d"),
    dass_anxiety_score: anxietyScore,
    dass_anxiety_level: getLevel(anxietyScore, "a"),
    dass_stress_score: stressScore,
    dass_stress_level: getLevel(stressScore, "s"),
  };
};

export const DassForm = ({ onNext, onBack }: DassFormProps) => {
  const form = useForm<DassFormValues>({
    resolver: zodResolver(dassFormSchema),
  });
  const onSubmit = (data: DassFormValues) => {
    onNext(calculateDassScores(data));
  };

  const QuestionSection = ({
    title,
    questions,
  }: {
    title: string;
    questions: { id: string; text: string }[];
  }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <Separator />
      <div className="mt-4 space-y-6">
        {questions.map((q, index) => (
          <FormField
            key={q.id}
            control={form.control}
            name={q.id as keyof DassFormValues}
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4 shadow-sm">
                <FormLabel>
                  {index + 1}. {q.text}
                </FormLabel>
                <FormControl>
                  {/* --- PERUBAHAN DI SINI --- */}
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
                  >
                    {[0, 1, 2, 3].map((val) => (
                      <FormItem
                        key={val}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={String(val)} />
                        </FormControl>
                        <FormLabel className="font-normal">{val}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 animate-fade-in"
      >
        <p className="text-sm text-gray-600">
          Pilih angka (0, 1, 2, atau 3) yang paling sesuai dengan kondisi Anda
          selama seminggu terakhir.
        </p>
        <QuestionSection
          title="Skala Depresi (D)"
          questions={dassQuestions.depression}
        />
        <QuestionSection
          title="Skala Kecemasan (A)"
          questions={dassQuestions.anxiety}
        />
        <QuestionSection
          title="Skala Stres (S)"
          questions={dassQuestions.stress}
        />
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
