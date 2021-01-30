import { useEffect, useState } from 'react'
import { Case } from '../../types/components/Case'
import { CPU } from '../../types/components/CPU'
import { GPU } from '../../types/components/GPU'
import { Motherboard } from '../../types/components/Motherboard'
import { PSU } from '../../types/components/PSU'
import { RAM } from '../../types/components/RAM'
import { Storage } from '../../types/components/Storage'
import { CaseFilters } from './components/case/CaseFilters'
import { CaseState } from './components/case/CaseState'
import { generateCaseFilters } from './components/case/generateCaseFilters'
import { CPUFilters } from './components/cpu/CPUFilters'
import { CPUState } from './components/cpu/CPUState'
import { generateCPUFilters } from './components/cpu/generateCPUFilters'
import { generateGPUFilters } from './components/gpu/generateGPUFilters'
import { GPUFilters } from './components/gpu/GPUFilters'
import { GPUState } from './components/gpu/GPUState'
import { generateMotherboardFilters } from './components/motherboard/generateMotherboardFilters'
import { MotherboardFilters } from './components/motherboard/MotherboardFilters'
import { MotherboardState } from './components/motherboard/MotherboardState'
import { generatePSUFilters } from './components/psu/generatePSUFilters'
import { PSUFilters } from './components/psu/PSUFilters'
import { PSUState } from './components/psu/PSUState'
import { generateRamFilters } from './components/ram/generateRamFilters'
import { RamFilters } from './components/ram/RamFilters'
import { RamState } from './components/ram/RamState'

interface Builder {
    cpu: CPUState
    gpu: GPUState
    chassis: CaseState
    mobo: MotherboardState
    ram: RamState
    psu: PSUState
}

export const useBuilder = (): Builder => {
    const [cpu, setCPU] = useState<CPU | null>(null)
    const [cpuFilters, setCPUFilters] = useState<CPUFilters>({})

    const [gpu, setGPU] = useState<GPU | null>(null)
    const [gpuFilters, setGPUFilters] = useState<GPUFilters>({})

    const [mobo, setMobo] = useState<Motherboard | null>(null)
    const [moboFilters, setMoboFilters] = useState<MotherboardFilters>({})

    const [ram, setRam] = useState<RAM | null>(null)
    const [ramFilters, setRamFilters] = useState<RamFilters>({})

    const [chassis, setChassis] = useState<Case | null>(null)
    const [chassisFilters, setChassisFilters] = useState<CaseFilters>({})

    const [psu, setPSU] = useState<PSU | null>(null)
    const [psuFilters, setPSUFilters] = useState<PSUFilters>({})

    const [storage, setStorage] = useState<Storage | null>(null)
    const [storageFilters, setStorageFilters] = useState<CaseFilters>({})

    useEffect(() => {
        setCPUFilters(generateCPUFilters(ram, mobo))
    }, [ram, mobo])

    useEffect(() => {
        setGPUFilters(generateGPUFilters(chassis))
    }, [chassis])

    useEffect(() => {
        setChassisFilters(generateCaseFilters(gpu, mobo))
    }, [gpu, mobo])

    useEffect(() => {
        setMoboFilters(generateMotherboardFilters(cpu, ram, chassis))
    }, [cpu, ram, chassis])

    useEffect(() => {
        setRamFilters(generateRamFilters(cpu, mobo))
    }, [cpu, mobo])

    useEffect(() => {
        setPSUFilters(generatePSUFilters(cpu, ram, gpu, mobo, storage))
    }, [cpu, ram, gpu, mobo, storage])

    return {
        cpu: {
            cpu,
            setCPU,
            cpuFilters
        },
        gpu: {
            gpu,
            setGPU,
            gpuFilters
        },
        chassis: {
            chassis,
            setChassis,
            chassisFilters
        },
        mobo: {
            mobo,
            setMobo,
            moboFilters
        },
        ram: {
            ram,
            setRam,
            ramFilters
        },
        psu: {
            psu,
            setPSU,
            psuFilters
        }
    }
}
