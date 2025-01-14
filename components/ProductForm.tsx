"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/schemas";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

type Props = {};

const ProductForm = (props: Props) => {
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: "",
      expDate: "",
      mfgDate: "",
    },
  });

  const onsubmit = (values: z.infer<typeof ProductSchema>) => {};

  return (
    <>
      <Card className="w-3/4 py-28 px-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onsubmit)}
            className="space-y-4 font-semibold"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g parleG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Brand name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g parleG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Price</FormLabel>
                  <FormControl>
                    <Input placeholder="INR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Expiration Date
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="MM / YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mfgDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Manufacture Date
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="MM / YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"destructive"}>
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default ProductForm;
