
export interface Article {
  id: number;
  title: string;
  introduction: string;
  sections: { heading: string; points: string[] }[];
  existingConclusion: string;
  generatedConclusion?: string;
}
