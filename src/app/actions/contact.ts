"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitInquiry(_prev: { sent?: boolean; error?: string } | null, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name || !email || !message) return { error: "Please fill in all fields." };
  await prisma.inquiry.create({ data: { name, email, message } });
  redirect("/contact?sent=1");
}
