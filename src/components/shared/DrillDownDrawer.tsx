import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function DrillDownDrawer({ open, onClose, date }: any) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Chi tiết hoạt động ngày {date}</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <p>Danh sách Commits: ...</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
