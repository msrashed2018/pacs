
export interface DashBoardModel {
    ctModalityStats?: CTModalityStats;
    mgModalityStats?: MGModalityStats;
    dxModalityStats?: DXModalityStats;
    dfModalityStats?: DFModalityStats;
    petModalityStats?: PETModalityStats;
    patientStats?: PatientStats;
    studyStats?: StudyStats;
}

export interface CTModalityStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

export interface MGModalityStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

export interface DXModalityStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

export interface DFModalityStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

export interface PETModalityStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

export interface PatientStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

export interface StudyStats {
    total?: number;
    yasterday?: number;
    lastweek?: number;
}

