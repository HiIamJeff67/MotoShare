import { point } from "./point.interface"

interface PeriodicOrderJsonbInterface {
    initPrice: number   // integer(5~3000)
    startCordLongitude: number
    startCordLatitude: number
    endCordLongitude: number
    endCordLatitude: number
    startAddress: string
    endAddress: string
    startAfter: Date
    endedAt: Date
    autoAccept?: boolean
}

export interface PeriodicPurchaseOrderJsonbInterface extends PeriodicOrderJsonbInterface {
    isUrgent?: boolean
    
}
export interface PeriodicSupplyOrderJsonbInterface extends PeriodicOrderJsonbInterface {
    tolerableRDV?: number    // double
}

/* 
    orderData: jsonb = {
        initPrice: int(5~3000)
        startCord: geometry_point({ x: number, y: number })
        endCord: geometry_point({ x: number, y: number })
        startAddress: string
        endAddress: string
        startAfter: Date
        endedAt: Date
*       isUrgent: boolean
    }
*/

/*
    orderData: jsonb = {
        initPrice: int(5~3000)
        startCord: geometry_point({ x: number, y: number })
        endCord: geometry_point({ x: number, y: number })
        startAddress: string
        endAddress: string
        startAfter: Date
        endedAt: Date
*       tolerableRDV: double
    }
*/