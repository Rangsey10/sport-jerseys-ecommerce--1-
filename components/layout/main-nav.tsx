import * as React from "react";
import Link from "next/link";

import type { NavItem } from "@/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link
        href="/"
        className="hidden items-center space-x-2 lg:flex"
        aria-label={siteConfig.name}
      >
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="hidden gap-6 lg:flex">
        {items?.map((item, index) =>
          item.href ? (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
              aria-disabled={item.disabled}
            >
              {item.title}
            </Link>
          ) : (
            <span
              key={index}
              className="flex items-center text-lg font-semibold text-muted-foreground sm:text-sm"
            >
              {item.title}
            </span>
          )
        )}
      </nav>
    </div>
  );
}
