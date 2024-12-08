export interface Division {
    id: number;
    name: string;
    upperDivisionId: number | null;
    collaborators: number;
    level: number;
    ambassadorName: string | null;
}

export interface DivisionWithSubdivisions extends Division {
    subdivisions: number;
    upperDivisionName?: string | null;
}