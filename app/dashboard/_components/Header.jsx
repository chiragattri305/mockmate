"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/question", label: "Questions" },
  { href: "/dashboard/game", label: "Quiz Arena" },
  { href: "/dashboard/leaderboard", label: "Leaderboard" },
  { href: "/dashboard/upgrade", label: "Upgrade" },
  { href: "/dashboard/howit", label: "How it works?" },
];

const Header = () => {
  const [isUserButtonLoaded, setUserButtonLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  const SkeletonLoader = () => (
    <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
  );

  useEffect(() => {
    const timer = setTimeout(() => setUserButtonLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const isActive = (href) =>
    href === "/dashboard" ? path === href || path.startsWith("/dashboard/interview") : path.startsWith(href);

  const linkClass = (href) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${
      isActive(href) ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="glass-nav sticky top-0 z-50">
      <div className="m-auto flex w-[90%] max-w-7xl items-center justify-between gap-4 py-3">
        <Link href="/dashboard" aria-label="MockMate dashboard">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <li className={linkClass(item.href)}>{item.label}</li>
            </Link>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {isUserButtonLoaded ? (
            <>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
                  <Button size="sm">Login</Button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <SkeletonLoader />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t lg:hidden">
          <ul className="m-auto flex w-[90%] flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <li className={`block py-2 ${linkClass(item.href)}`}>{item.label}</li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
