"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Avoid layout shift
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full transition-all duration-300 ease-in-out hover:bg-muted",
        "w-9 h-9 relative overflow-hidden"
      )}
      aria-label="Toggle theme"
    >
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-transform duration-500",
        theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
      )}>
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      </div>
      <div className={cn(
        "absolute inset-0 flex items-center justify-center transition-transform duration-500",
        theme === "light" ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
      )}>
        <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
      </div>
    </Button>
  );
};

export { ThemeSwitcher };
