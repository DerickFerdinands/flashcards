"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

export function CreateSetButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline" size="lg">
          <LogIn className="mr-2 h-4 w-4" />
          Login to Create Sets
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/create">
      <Button size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Create New Set
      </Button>
    </Link>
  );
}