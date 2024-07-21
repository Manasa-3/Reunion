import { SectionIcon } from "@radix-ui/react-icons";
import { Items, columns } from "./Items/columns";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import RootLayout from './layout';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
export function ModeToggle() {
  const { setTheme } = useTheme()
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function getItems(): Promise<Items[]> {
   const res = await fetch('https://file.notion.so/f/f/ca71608c-1cc3-4167-857a-24da97c78717/b041832a-ec40-47bb-b112-db9eeb72f678/sample-data.json?id=ce885cf5-d90e-46f3-ab62-c3609475cfb6&table=block&spaceId=ca71608c-1cc3-4167-857a-24da97c78717&expirationTimestamp=1721577600000&signature=qGhdtX78DZGn3BZcfi-_z_NIFTBYLEWoQ4lvGEt6vzA&downloadName=sample-data.json')
   const data = await res.json()
   return data
  }

export default async function Page() {
    const data = await getItems()
    return (
      <RootLayout>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <section className="py-24">
            <div className="container">
                <h1 className="text-center font-extrabold text-3x1">Reunion</h1>
                
                <DataTable columns={columns} data={data}/>
            </div>
         </section>
         </ThemeProvider>
      </RootLayout>
           
    )
}