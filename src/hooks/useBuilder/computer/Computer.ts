import { Component } from './Component'

export interface Computer {
    name: string
    cpuId: number | null
    gpu?: Component | null
    ram: Component | null
    motherboardId: number | null
    storages: Array<Component | null>
    caseId: number | null
    psuId: number | null
}
