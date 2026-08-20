export type ScriptTrainingCategory = 
  | 'TECH_REVIEW' 
  | 'PRODUCT_REVIEW' 
  | 'TECH_NEWS' 
  | 'COMPARISON' 
  | 'BENCHMARK_REVIEW' 
  | 'LONG_FORM' 
  | 'SHORT_FORM' 
  | 'OTHER';

export type SentenceLengthPreference = 
  | 'PUNCHY_SHORT' 
  | 'BALANCED' 
  | 'DETAILED_TECHNICAL';

export type TechnicalDepth = 
  | 'MAINSTREAM_CONSUMER' 
  | 'ENTHUSIAST_CREATOR' 
  | 'HARDCORE_ENGINEER';

export interface ScriptTrainingSample {
  id: string;
  title: string;
  category?: ScriptTrainingCategory;
  scriptBody: string;
  notes?: string;
  createdAt: string;
}

export interface CreatorScriptTrainingProfile {
  profileId: string;
  userId: string;
  writingInstructions: string;
  language: string;
  tone?: string;
  audience?: string;
  hookStyle?: string;
  introductionStyle?: string;
  bodyStyle?: string;
  conclusionStyle?: string;
  sentenceLengthPreference?: SentenceLengthPreference;
  technicalDepth?: TechnicalDepth;
  preferredVocabulary?: string[];
  forbiddenPhrases?: string[];
  sampleScripts: ScriptTrainingSample[];
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SCRIPT_TRAINING_PROFILE: CreatorScriptTrainingProfile = {
  profileId: 'default-profile',
  userId: 'global-default',
  writingInstructions: 'Deliver clear, evidence-grounded technology analysis. Maintain high credibility, avoid hyperbole, and clearly separate short burst benchmarks from sustained 30-minute thermal load.',
  language: 'English',
  tone: 'Authoritative, engaging, direct, and balanced',
  audience: 'Technology buyers, PC builders, mobile enthusiasts, and creators',
  hookStyle: 'Data-driven contradiction or unexpected real-world finding',
  introductionStyle: 'Direct problem framing and laboratory testing premise',
  bodyStyle: 'Structured architectural specs followed by normalized benchmarks and thermal analysis',
  conclusionStyle: 'Nuanced buyer persona recommendations and explicit tradeoff breakdown',
  sentenceLengthPreference: 'BALANCED',
  technicalDepth: 'ENTHUSIAST_CREATOR',
  preferredVocabulary: ['sustained load', 'thermal throttling', 'efficiency per watt', '1% low frame pacing', 'silicon parity'],
  forbiddenPhrases: ['destroys the competition', 'game changer', 'insane speed', 'blows away', 'unbeatable'],
  sampleScripts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
