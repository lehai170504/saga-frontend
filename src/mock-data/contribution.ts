// src/mock-data/contribution.ts

// Dữ liệu Radar Chart cho từng kỹ năng của một sinh viên tiêu biểu (ví dụ: Nguyễn Văn A)
export const studentSkillData = [
  { subject: "Viết Code (Commits)", A: 90, B: 60, fullMark: 100 },
  { subject: "Đúng hạn (Deadline)", A: 95, B: 80, fullMark: 100 },
  { subject: "Thảo luận (Slack/Teams)", A: 85, B: 90, fullMark: 100 },
  { subject: "Review Code (Pull Request)", A: 70, B: 40, fullMark: 100 },
  { subject: "Hỗ trợ đồng đội", A: 80, B: 70, fullMark: 100 },
];

// Danh sách tổng hợp điểm số continuous assessment của cả nhóm
export const teamContributionRows = [
  {
    id: "SV001",
    name: "Nguyễn Văn A",
    role: "Leader",
    commits: 45,
    PRs: 12,
    tasks: 8,
    score: 9.2,
  },
  {
    id: "SV002",
    name: "Trần Thị B",
    role: "Member",
    commits: 32,
    PRs: 5,
    tasks: 7,
    score: 8.5,
  },
  {
    id: "SV003",
    name: "Lê Văn C",
    role: "Member",
    commits: 28,
    PRs: 4,
    tasks: 6,
    score: 7.9,
  },
  {
    id: "SV004",
    name: "Phạm Minh D",
    role: "Member",
    commits: 8,
    PRs: 1,
    tasks: 3,
    score: 4.5,
  }, // Cảnh báo nguy cơ
];
