export interface Class {
  id: string; // UUID
  classCode: string;
  name: string;
  createdAt: string; // LocalDateTime string
  updatedAt: string; // LocalDateTime string
}

export interface ClassRequest {
  classCode: string;
  name: string;
}
