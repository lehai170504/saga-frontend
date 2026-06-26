import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface FormData {
  className: string;
  subject: string;
  lecturer: string;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId: string | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSave: () => void;
}

// Mock Data cho Dropdown
const MOCK_SUBJECTS = [
  "Công nghệ phần mềm",
  "Lập trình C# nâng cao",
  "Nhập môn Lập trình",
  "Hệ cơ sở dữ liệu",
  "Thiết kế UI/UX",
];

const MOCK_LECTURERS = [
  "Dr. Nguyen Van A",
  "Mr. Tran Thi B",
  "Dr. Le Van C",
  "Ms. Pham Hoang D",
  "Prof. Tran Anh E",
];

export function ClassModal({
  isOpen,
  onClose,
  editingId,
  formData,
  setFormData,
  onSave,
}: ClassModalProps) {
  const [lecturerSearch, setLecturerSearch] = useState("");
  const [isLecturerDropdownOpen, setIsLecturerDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lọc giảng viên theo từ khoá
  const filteredLecturers = MOCK_LECTURERS.filter((l) =>
    l.toLowerCase().includes(lecturerSearch.toLowerCase())
  );

  // Xử lý click ra ngoài để đóng dropdown tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLecturerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setLecturerSearch(formData.lecturer);
        setIsLecturerDropdownOpen(false);
      }, 0);
    }
  }, [isOpen, formData.lecturer]);

  const handleLecturerSelect = (lecturer: string) => {
    setFormData({ ...formData, lecturer });
    setLecturerSearch(lecturer);
    setIsLecturerDropdownOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {editingId ? "Sửa thông tin lớp học" : "Thêm lớp học mới"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Vui lòng nhập các thông tin cần thiết để {editingId ? "cập nhật" : "tạo mới"} lớp học.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="className" className="text-right font-medium text-foreground">
              Tên lớp
            </Label>
            <Input
              id="className"
              placeholder="VD: SE102.M21"
              className="col-span-3 rounded-xl focus-visible:ring-ring bg-background border-input uppercase"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right font-medium text-foreground">
              Môn học
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.subject}
                onValueChange={(val) => setFormData({ ...formData, subject: val })}
              >
                <SelectTrigger className="w-full rounded-xl bg-background border-input">
                  <SelectValue placeholder="Chọn môn học..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  {MOCK_SUBJECTS.map((sub, idx) => (
                    <SelectItem key={idx} value={sub} className="cursor-pointer">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="lecturer" className="text-right mt-3 font-medium text-foreground">
              Giảng viên
            </Label>
            <div className="col-span-3 relative" ref={dropdownRef}>
              <div className="relative">
                <Input
                  id="lecturer"
                  placeholder="Tìm kiếm giảng viên..."
                  className="rounded-xl focus-visible:ring-ring bg-background border-input pl-9"
                  value={lecturerSearch}
                  onChange={(e) => {
                    setLecturerSearch(e.target.value);
                    setFormData({ ...formData, lecturer: e.target.value });
                    setIsLecturerDropdownOpen(true);
                  }}
                  onFocus={() => setIsLecturerDropdownOpen(true)}
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>

              {isLecturerDropdownOpen && lecturerSearch.trim().length > 0 && (
                <div className="absolute z-50 w-full mt-2 rounded-xl border border-border bg-card shadow-lg max-h-[200px] overflow-y-auto">
                  {filteredLecturers.length > 0 ? (
                    <div className="p-1">
                      {filteredLecturers.map((lecturer, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 text-sm rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleLecturerSelect(lecturer)}
                        >
                          {lecturer}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-center text-muted-foreground">
                      Không tìm thấy giảng viên
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} className="rounded-xl font-bold">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
