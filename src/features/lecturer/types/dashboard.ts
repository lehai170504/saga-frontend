// Placeholder DTOs based on Backend Handoff Document
// DO NOT INVENT DTOs - Wait for actual Swagger/OpenAPI from Backend

export interface DashboardTeamsProgress {
  // TODO: Update exactly matching Backend Swagger
  [key: string]: unknown;
}

export interface DashboardContributionSummary {
  // TODO: Update exactly matching Backend Swagger
  [key: string]: unknown;
}

export interface DashboardTrends {
  // TODO: Update exactly matching Backend Swagger
  [key: string]: unknown;
}

export interface DashboardAtRiskSummary {
  // QUAN TRỌNG: Backend hiện chỉ có warning deterministic: OVERDUE_TASK
  // Không implement: GHOSTING, TOXIC_COMMUNICATION, TECHNICAL_DEBT, AI-generated risk score
  // TODO: Update exactly matching Backend Swagger
  [key: string]: unknown;
}
