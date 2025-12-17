"use client"

import React from "react"
import { useParams } from "react-router-dom"
import MainContent from "./components/MainContent"
import KunjunganLayanan from "@/components/kunjunganLayanan"
import KunjunganUnit from "@/components/kunjunganUnit"
import OrderLab from "@/components/orderLab"

const EmrIgdIndexPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-muted-foreground">
        No. Registrasi: <span className="font-medium">{id}</span>
      </div>

      <MainContent />
      <KunjunganUnit />
      <KunjunganLayanan />
      <OrderLab />
      
    </div>
  )
}

export default EmrIgdIndexPage
