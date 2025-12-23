"use client"

import React from "react"
import { useParams } from "react-router-dom"
import MainContent from "./components/MainContent"
import KunjunganLayanan from "@/components/kunjunganLayanan"
import KunjunganUnit from "@/components/kunjunganUnit"
import OrderLab from "@/components/orderLab"
import OrderRadiologi from "@/components/orderRadiologi"
import Asesment from "./components/Asesment"

const EmrIgdIndexPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        No. Registrasi: <span className="font-medium">{id}</span>
      </div>

      <MainContent />
      <KunjunganUnit api="EmrIgdAPI"/>
      {/* <OrderLab />
      <OrderRadiologi/> */}
      <Asesment/>
    </div>
  )
}

export default EmrIgdIndexPage
