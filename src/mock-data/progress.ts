// src/mock-data/progress.ts

// Dữ liệu giả lập cho Heatmap hoạt động theo ngày (30 ngày gần nhất)
export const heatmapData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));

  // Tạo mức độ đóng góp ngẫu nhiên từ 0 đến 4
  const count = Math.floor(Math.random() * 12);
  let level = 0;
  if (count > 0 && count <= 3) level = 1;
  else if (count > 3 && count <= 6) level = 2;
  else if (count > 6 && count <= 9) level = 3;
  else if (count > 9) level = 4;

  return {
    date: date.toISOString().split("T")[0],
    count,
    level, // 0: No activity, 1-4: Increasing activity
  };
});

// Dữ liệu cho Burndown Chart (Tiến độ 2 tuần của Sprint)
export const burndownData = [
  { day: "Ngày 1", ideal: 100, actual: 100 },
  { day: "Ngày 2", ideal: 90, actual: 95 },
  { day: "Ngày 3", ideal: 80, actual: 82 },
  { day: "Ngày 4", ideal: 70, actual: 75 },
  { day: "Ngày 5", ideal: 60, actual: 60 },
  { day: "Ngày 6", ideal: 50, actual: 58 },
  { day: "Ngày 7", ideal: 40, actual: 52 },
  { day: "Ngày 8", ideal: 30, actual: 40 },
  { day: "Ngày 9", ideal: 20, actual: 25 },
  { day: "Ngày 10", ideal: 10, actual: 12 },
  { day: "Ngày 11", ideal: 0, actual: 0 },
];
