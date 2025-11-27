"use client";
import { useSession, signOut } from "next-auth/react";
import NotificationsDropdown from "./NotificationsDropdown";

export default function UserMenu() {
  const { data } = useSession();
  const name = data?.user?.name ?? data?.user?.email ?? "User";

  return (
    <div className="flex items-center gap-3">
        <NotificationsDropdown />
        <div className="text-sm text-neutral-600">{name}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded bg-neutral-100 text-sm px-3 py-1 hover:bg-neutral-200 transition-colors"
          suppressHydrationWarning={true}
        >
          Sign out
        </button>
    </div>
  );
}
