import { SectionIcon } from "@radix-ui/react-icons";
import { Items, columns } from "./columns";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
    

async function getItems(): Promise<Items[]> {
   const res = await fetch('https://file.notion.so/f/f/ca71608c-1cc3-4167-857a-24da97c78717/b041832a-ec40-47bb-b112-db9eeb72f678/sample-data.json?id=ce885cf5-d90e-46f3-ab62-c3609475cfb6&table=block&spaceId=ca71608c-1cc3-4167-857a-24da97c78717&expirationTimestamp=1721577600000&signature=qGhdtX78DZGn3BZcfi-_z_NIFTBYLEWoQ4lvGEt6vzA&downloadName=sample-data.json')
   const data = await res.json()
   return data
  }

export default async function Page() {
    const data = await getItems()
    return (
        <section className="py-24">
            <div className="container">
                <h1 className="text-3x1 font-bold">All Items</h1>
                <DataTable columns={columns} data={data}/>
            </div>
         </section>   
    )
}