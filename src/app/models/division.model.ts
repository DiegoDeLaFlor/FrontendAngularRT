export interface Division {
    id: number;
    name: string;
    level: number;
    collaborators: number;
    ambassadorName: string | null;
    created_at: string;
    updated_at: string;
    upperDivision?: UpperDivision | null;
}

export interface DivisionWithSubdivisions extends Division {
    subdivisions: number;
    upperDivisionName?: string | null;
}

export interface DivisionsResponse {
    results: DivisionWithSubdivisions[];
    total: number;
    page: number;
    limit: number;
}

export interface UpperDivision {
    id: number;
    name: string;
    level: number;
    collaborators: number;
    ambassadorName: string | null;
    created_at: string;
    updated_at: string;
}
