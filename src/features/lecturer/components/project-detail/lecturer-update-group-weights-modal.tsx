import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Loader2, Save } from "lucide-react";
import { useUpdateProjectGroupWeights } from "@/features/projects/hooks/useProjects";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface LecturerUpdateGroupWeightsModalProps {
  projectId: string;
  courseId: string;
  teamId: string;
  teamName: string;
}

export function LecturerUpdateGroupWeightsModal({ projectId, courseId, teamId, teamName }: LecturerUpdateGroupWeightsModalProps) {
  const [open, setOpen] = useState(false);
  const [codeWeight, setCodeWeight] = useState("0");
  const [testWeight, setTestWeight] = useState("0");
  const [documentWeight, setDocumentWeight] = useState("0");
  const [researchWeight, setResearchWeight] = useState("0");
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const updateWeights = useUpdateProjectGroupWeights(projectId);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setCodeWeight("0");
      setTestWeight("0");
      setDocumentWeight("0");
      setResearchWeight("0");
      setNote("");
    }
  };

  const handleUpdate = () => {
    const c = parseFloat(codeWeight);
    const test = parseFloat(testWeight);
    const doc = parseFloat(documentWeight);
    const res = parseFloat(researchWeight);

    if (isNaN(c) || isNaN(test) || isNaN(doc) || isNaN(res)) {
      toast.error("Vui lòng nhập số hợp lệ");
      return;
    }

    if (Math.abs(c + test + doc + res - 100) > 0.01) {
      toast.warning("Lưu ý: Tổng trọng số nên bằng 100%. Hãy kiểm tra lại nếu cố ý.");
    }

    const codeW = c;
    const testW = test;
    const docW = doc;
    const resW = Math.round((100 - c - test - doc) * 100) / 100; // Strictly guarantee sum is 100

    updateWeights.mutate(
      {
        groupId: teamId,
        codeWeight: codeW,
        testWeight: testW,
        documentWeight: docW,
        researchWeight: resW,
        note
      },
      {
        onSuccess: () => {
          setOpen(false);
          // Invalidate Lecturer's team detail to get latest stats
          queryClient.invalidateQueries({ queryKey: ["teamDetail", courseId, teamId] });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl h-10 px-5 shadow-md shadow-amber-500/20 border-amber-500/50 text-amber-600 hover:bg-amber-500/10 font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto">
          <Scale className="w-5 h-5" />
          Sửa Trọng số
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-background/95 backdrop-blur-3xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Scale className="w-4 h-4 text-amber-500" />
            </div>
            Cập nhật Trọng số Nhóm
          </DialogTitle>
          <DialogDescription>
            Điều chỉnh trọng số đánh giá riêng cho nhóm <strong className="text-foreground">{teamName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Code</label>
              <div className="relative">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={codeWeight}
                  onChange={(e) => setCodeWeight(e.target.value)}
                  className="rounded-xl bg-muted/20 border-border/50 text-center font-bold pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Test</label>
              <div className="relative">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={testWeight}
                  onChange={(e) => setTestWeight(e.target.value)}
                  className="rounded-xl bg-muted/20 border-border/50 text-center font-bold pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Document</label>
              <div className="relative">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={documentWeight}
                  onChange={(e) => setDocumentWeight(e.target.value)}
                  className="rounded-xl bg-muted/20 border-border/50 text-center font-bold pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Research</label>
              <div className="relative">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={researchWeight}
                  onChange={(e) => setResearchWeight(e.target.value)}
                  className="rounded-xl bg-muted/20 border-border/50 text-center font-bold pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold text-foreground">Ghi chú thay đổi</label>
            <Textarea
              placeholder="Vd: Cập nhật lại trọng số sau review giữa kỳ..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl bg-muted/20 border-border/50 min-h-[80px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="rounded-xl hover:bg-muted/50"
            disabled={updateWeights.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={updateWeights.isPending}
            className="rounded-xl bg-amber-500 text-white hover:bg-amber-600 px-6"
          >
            {updateWeights.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu Trọng số
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
