"use client";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
// import { auth } from "@/lib/firebase/client";
import React from "react";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut();
  }

  return (
    <Button size="sm" variant="outline" onClick={handleLogout}>
      ログアウト
    </Button>
  );
}
