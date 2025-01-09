export interface POrderInterface {
    id: string;
    description: string;
    tolerableRDV: number;
    startAfter: Date;
    initPrice: number;
    startAddress: string;
    endAddress: string;
    updatedAt: Date;
    endedAt: Date;
    scheduledDay: string;
}