export enum AppState {
    IDLE = 'IDLE',
    ANALYZING = 'ANALYZING',
    CLARIFICATION = 'CLARIFICATION',
    RESULTS = 'RESULTS',
    ERROR = 'ERROR'
}

export interface ArtifactIdentity {
    name: string;
    category: string;
    timePeriod: string;
    creationDate: string;
    originalPurpose: string;
}

export interface ArtifactEvolution {
    historicalChanges: string[];
    modernStatus: 'bekannt' | 'vergessen' | 'verdrängt';
    replacedBy?: string;
    culturalSignificance: string;
}

export interface ArtifactStory {
    title: string;
    narrative: string; // Sherlock Holmes ICH-Form (kurze Geschichte)
    longNarrative?: string; // NEU: Lange historische Erzählung (3rd Person)
    keyMoments: string[];
    deductions?: string[]; // Sherlock-style clues
    detailHighlights?: string[]; // Notable details
    summary?: string; // 3-4 sentence conclusion
}

export interface TimelineMilestone {
    year: number | string;
    label: string;
    description: string;
    icon: string; // emoji
}

export interface RarityScores {
    rarity: number; // 0-10
    condition: number; // 0-10
    historicalValue: number; // 0-10
    overall: number; // calculated average
}

export interface ModernComparison {
    modernName: string;
    comparisons: ComparisonPoint[];
}

export interface SocialContext {
    genderRole?: string;      // "Typische Männerarbeit" oder "Frauendomäne"
    socialClass?: string;     // "Bürgerliche Handwerker", "Arbeiterklasse"
}

export interface EconomicContext {
    historicalPrice?: string; // "ca. 5 Gulden (1890)"
    modernEquivalent?: string; // "heute ca. 50-70€"
}

export interface VisualAnalysis {  // NUR für Fotos/Gemälde
    composition?: string;           // Komposition, Licht, Perspektive
    clothing?: string;              // Kleidung → Status/Zeit
    background?: string;            // Architektur/Umgebung
    invisibleContext?: {
        missing?: string;           // Was fehlt im Bild?
        creator?: string;           // Fotograf/Maler & Absicht
        purpose?: string;           // Zweck des Bildes
    };
    representationChange?: string;  // Darstellungswandel über Zeit (optional)
}

export interface ComparisonPoint {
    category: string;
    historical: string;
    modern: string;
    icon: string; // emoji
}

export interface ClarificationNeeds {
    question: string;
    options: string[];
}

export interface ArtifactAnalysis {
    identity: ArtifactIdentity;
    evolution: ArtifactEvolution;
    story: ArtifactStory;
    timeline?: TimelineMilestone[];
    rarityScores?: RarityScores;
    modernComparison?: ModernComparison;
    socialContext?: SocialContext;
    economicContext?: EconomicContext;
    visualAnalysis?: VisualAnalysis;  // NUR bei isPhotography oder isPainting
    needsClarification?: {
        question: string;
        options: string[];
    };
    confidence: number; // 0-100
}
