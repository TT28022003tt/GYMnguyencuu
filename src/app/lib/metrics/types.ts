export interface BasicMetrics {
    Height?: number;
    Weight?: number;
    BMI?: number;
    Chest?: number;
    Waist?: number;
    hips?: number;
    Arm?: number;
    Thigh?: number;
    Calf?: number;
    Mota?: string;
    idMaHV: number;
    Ten?: string;
}

export interface AdvancedMetrics {
    BodyFatPercent?: number;
    MuscleMass?: number;
    VisceralFat?: number;
    BasalMetabolicRate?: number;
    BoneMass?: number;
    WaterPercent?: number;
    Mota?: string;
    idMaHV: number;
    Ten?: string;
}

export interface Metrics {
    type: 'basic' | 'advanced';
    data: BasicMetrics | AdvancedMetrics;
}