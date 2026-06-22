import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl space-y-6">
      <PageHeader
        title="Cài đặt hệ thống"
        description="Cấu hình hiển thị và kết nối API"
      />
      <Card className="p-6">
        <h3 className="font-bold mb-4">Cấu hình cá nhân</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Chế độ hiển thị</span>
            {/* Switch component của shadcn */}
          </div>
          <div className="flex justify-between items-center">
            <span>Múi giờ</span>
            <Select>...</Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
