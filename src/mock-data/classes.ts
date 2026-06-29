export const semestersData = [
  { id: "summer-2026", name: "Summer 2026" },
  { id: "spring-2026", name: "Spring 2026" },
  { id: "fall-2025", name: "Fall 2025" },
];

export interface Subject {
  id: string;
  code: string;
  name: string;
  icon: string;
  classes: {
    id: string;
    name: string;
    project: string;
    lecturer?: string;
    slot?: string;
  }[];
}

export const subjectsData: Record<string, Subject[]> = {
  "summer-2026": [
    {
      id: "wdp301",
      code: "WDP301",
      name: "Dự án phát triển web",
      icon: "globe",
      classes: [
        { id: "wdp301-pbl", name: "Lớp SE1801", project: "Nhóm PBL-01", lecturer: "Dr. Nguyen Van A", slot: "Slot 1 (7:00 - 9:15)" },
      ]
    },
    {
      id: "prn211",
      code: "PRN211",
      name: "Lập trình C# nâng cao",
      icon: "cpu",
      classes: [
        { id: "prn211-pbl", name: "Lớp SE1802", project: "Nhóm PBL-02", lecturer: "Mr. Tran Thi B", slot: "Slot 2 (9:30 - 11:45)" },
      ]
    },
    {
      id: "cs101",
      code: "CS101",
      name: "Nhập môn Lập trình",
      icon: "code",
      classes: [
        { id: "cs101-pbl", name: "Lớp SE1803", project: "Nhóm PBL-03", lecturer: "Dr. Le Van C", slot: "Slot 3 (12:30 - 14:45)" },
      ]
    },
    {
      id: "swt301",
      code: "SWT301",
      name: "Kiểm thử phần mềm",
      icon: "book",
      classes: [
        { id: "swt301-pbl", name: "Lớp SE1804", project: "Nhóm PBL-04", lecturer: "Ms. Pham Thi D", slot: "Slot 4 (15:00 - 17:15)" },
      ]
    },
    {
      id: "dbi202",
      code: "DBI202",
      name: "Hệ cơ sở dữ liệu",
      icon: "database",
      classes: [
        { id: "dbi202-pbl", name: "Lớp SE1805", project: "Nhóm PBL-05", lecturer: "Mr. Hoang Van E", slot: "Slot 1 (7:00 - 9:15)" },
      ]
    }
  ],
  "spring-2026": [
    {
      id: "wdp301",
      code: "WDP301",
      name: "Dự án phát triển web",
      icon: "globe",
      classes: [
        { id: "wdp301-pbl", name: "Lớp SE1801", project: "Nhóm PBL-01", lecturer: "Dr. Nguyen Van A", slot: "Slot 1 (7:00 - 9:15)" },
      ]
    },
    {
      id: "prn211",
      code: "PRN211",
      name: "Lập trình C# nâng cao",
      icon: "cpu",
      classes: [
        { id: "prn211-pbl", name: "Lớp SE1802", project: "Nhóm PBL-02", lecturer: "Mr. Tran Thi B", slot: "Slot 2 (9:30 - 11:45)" },
      ]
    },
    {
      id: "cs101",
      code: "CS101",
      name: "Nhập môn Lập trình",
      icon: "code",
      classes: [
        { id: "cs101-pbl", name: "Lớp SE1803", project: "Nhóm PBL-03", lecturer: "Dr. Le Van C", slot: "Slot 3 (12:30 - 14:45)" },
      ]
    }
  ],
  "fall-2025": [
    {
      id: "swt301",
      code: "SWT301",
      name: "Kiểm thử phần mềm",
      icon: "book",
      classes: [
        { id: "swt301-pbl", name: "Lớp SE1804", project: "Nhóm PBL-04", lecturer: "Ms. Pham Thi D", slot: "Slot 4 (15:00 - 17:15)" },
      ]
    },
    {
      id: "dbi202",
      code: "DBI202",
      name: "Hệ cơ sở dữ liệu",
      icon: "database",
      classes: [
        { id: "dbi202-pbl", name: "Lớp SE1805", project: "Nhóm PBL-05", lecturer: "Mr. Hoang Van E", slot: "Slot 1 (7:00 - 9:15)" },
      ]
    }
  ],
};
