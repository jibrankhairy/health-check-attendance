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

const fasQuestions = [
  { id: "fas1", text: "Saya terganggu karena kelelahan." },
  { id: "fas2", text: "Saya sangat cepat untuk mudah merasa lelah." },
  {
    id: "fas3",
    text: "Saya tidak dapat banyak melakukan sesuatu selama seharian penuh.",
  },
  { id: "fas4", text: "Saya memiliki energi untuk aktivitas harian." },
  { id: "fas5", text: "Secara fisik, saya merasa kelelahan." },
  { id: "fas6", text: "Saya memiliki masalah untuk mulai berpikir." },
  { id: "fas7", text: "Saya memiliki masalah untuk berpikir secara jernih." },
  {
    id: "fas8",
    text: "Saya tidak punya gairah untuk melakukan segala sesuatu.",
  },
  { id: "fas9", text: "Secara mental, saya merasa kelelahan." },
  {
    id: "fas10",
    text: "Ketika saya melakukan sesuatu, saya dapat berkonsentrasi dengan baik.",
  },
];

const answerOptions = [
  { value: "1", label: "Tidak Pernah" },
  { value: "2", label: "Kadang-kadang" },
  { value: "3", label: "Secara Teratur" },
  { value: "4", label: "Sering" },
  { value: "5", label: "Selalu" },
];

const schemaObject = Object.fromEntries(
  fasQuestions.map((q) => [
    q.id,
    z.string().min(1, "Harap pilih salah satu jawaban."),
  ])
);
const fasFormSchema = z.object(schemaObject);

export type FasFormValues = z.infer<typeof fasFormSchema>;

type FasFormProps = {
  onNext: (data: FasFormValues) => void;
  onBack: () => void;
  defaultValues: any;
};

export const FasForm = ({ onNext, onBack, defaultValues }: FasFormProps) => {
  const form = useForm<FasFormValues>({
    resolver: zodResolver(fasFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-10 animate-fade-in"
      >
        <p className="text-sm text-gray-600">
          Pilih salah satu jawaban yang paling sesuai dengan apa yang Anda
          rasakan.
        </p>

        <div className="space-y-8">
          {fasQuestions.map((q, index) => (
            <FormField
              key={q.id}
              control={form.control}
              name={q.id as keyof FasFormValues}
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4 shadow-sm">
                  <FormLabel className="text-base">
                    {index + 1}. {q.text}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4"
                    >
                      {answerOptions.map((opt) => (
                        <FormItem
                          key={opt.value}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <RadioGroupItem value={opt.value} />
                          </FormControl>
                          <FormLabel className="font-normal text-sm">
                            {opt.label}
                          </FormLabel>
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

        <CardFooter className="px-0 pt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button
            type="submit"
            className="bg-[#01449D] hover:bg-[#01449D]/90 text-white"
            disabled={form.formState.isSubmitting}
          >
            Lanjutkan
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
