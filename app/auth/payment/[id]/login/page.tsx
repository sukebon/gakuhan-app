import React from "react";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/firebase/server";
import { School } from "@/utils/school.interface";
import LoginForm from "@/app/auth/login/LoginForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function PaymentLoginPage({ params }: Props) {
  const { id } = params;

  const schoolSnap = await db.collection("schools").doc(id).get();

  if (!schoolSnap.exists) return notFound();
  const schoolRaw = JSON.stringify(schoolSnap.data());
  const school = JSON.parse(schoolRaw) as School;

  if (!school.isPublic || school.isDeleted) return notFound();

  const session = await auth();
  if (session) {
    redirect(`/student-register/${id}`);
  }
  return (
    <div className="w-full flex justify-center items-center min-h-[100vh]">
      <LoginForm />
    </div>
  );
}
