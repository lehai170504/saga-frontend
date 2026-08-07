export interface PeerReviewCriteria {
  id: string;
  name: string;
  weight: number;
  description: string | null;
}

export interface PeerReviewDefaultRubricResponse {
  id: string;
  criteriaList: PeerReviewCriteria[];
}

export interface PeerReviewRubricResponse {
  teamId: string;
  isCustom: boolean;
  criteriaList: PeerReviewCriteria[];
}

export interface PeerReviewItem {
  criteriaId: string;
  rating: number; 
  comment: string | null;
}

export interface PeerReviewRecord {
  id: string;
  reviewerId: string;
  revieweeId: string;
  totalStarRating: number;
  items: PeerReviewItem[];
  submittedAt: string;
}

export interface SprintPeerReviewResponse {
  sprintId: string;
  teamId: string;
  reviews: PeerReviewRecord[];
}
