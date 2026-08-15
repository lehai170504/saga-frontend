"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { useUpdateProjectGroupWeights } from "@/features/projects/hooks/useProjects";
import { TeamContributionWeightItem } from "../../types/contribution";

interface TeamWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamContributionWeightItem | null;
  onSuccess?: () => void;
}

export function TeamWeightModal({ isOpen, onClose, team, onSuccess }: TeamWeightModalProps) {
  const { mutate: updateWeights, isPending } = useUpdateProjectGroupWeights(team?.projectId || "");

  const [codeWeight, setCodeWeight] = useState<number>(0);
  const [testWeight, setTestWeight] = useState<number>(0);
  const [documentWeight, setDocumentWeight] = useState<number>(0);
  const [researchWeight, setResearchWeight] = useState<number>(0);

  useEffect(() => {
    if (team) {
      setCodeWeight(Number((team.codeWeight ?? 0).toFixed(2)));
      setTestWeight(Number((team.testWeight ?? 0).toFixed(2)));
      setDocumentWeight(Number((team.documentWeight ?? 0).toFixed(2)));
      setResearchWeight(Number((team.researchWeight ?? 0).toFixed(2)));
    }
  }, [team]);

  const totalWeight = Math.round((codeWeight + testWeight + documentWeight + researchWeight) * 100) / 100;
  const isValid = totalWeight === 100;

  const handleSubmit = () => {
    if (!team) return;
    if (!isValid) {
      toast.error("Tổng trọng số phải bằng ĐÚNG 100%");
      return;
    }

    const c = codeWeight;
    const t = testWeight;
    const d = documentWeight;
    const r = Math.round((100 - c - t - d) * 100) / 100; // Strictly guarantee sum is 100

    updateWeights(
      {
        groupId: team.teamId,
        codeWeight: c,
        testWeight: t,
        documentWeight: d,
        researchWeight: r,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
        onError: (err: Error | Record<string, unknown>) => {
          const resErr = err as Error & { response?: { data?: { message?: string } } };
          toast.error(resErr?.response?.data?.message || resErr?.message || "Có lỗi xảy ra khi lưu thay đổi");
        },
      }
    );
  };

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cấu hình Trọng số - {team.teamName}</DialogTitle>
          <DialogDescription>
            {team.projectName} ({team.projectTypeName})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-primary/10 text-primary rounded-xl flex items-start gap-2 text-sm">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Tổng các trọng số của nhóm phải bằng đúng 100%.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold w-1/3">1. Lập trình (Code)</Label>
              <div className="flex items-center gap-2 w-2/3">
                <Input
                  type="number"
                  step="0.01"
                  value={codeWeight}
                  onChange={(e) => setCodeWeight(parseFloat(e.target.value) || 0)}
                  className="h-10 text-center font-bold"
                />
                <span className="text-sm font-medium w-6">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold w-1/3">2. Kiểm thử (Test)</Label>
              <div className="flex items-center gap-2 w-2/3">
                <Input
                  type="number"
                  step="0.01"
                  value={testWeight}
                  onChange={(e) => setTestWeight(parseFloat(e.target.value) || 0)}
                  className="h-10 text-center font-bold"
                />
                <span className="text-sm font-medium w-6">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold w-1/3">3. Viết Tài liệu (Docs)</Label>
              <div className="flex items-center gap-2 w-2/3">
                <Input
                  type="number"
                  step="0.01"
                  value={documentWeight}
                  onChange={(e) => setDocumentWeight(parseFloat(e.target.value) || 0)}
                  className="h-10 text-center font-bold"
                />
                <span className="text-sm font-medium w-6">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold w-1/3">4. Nghiên cứu (Research)</Label>
              <div className="flex items-center gap-2 w-2/3">
                <Input
                  type="number"
                  step="0.01"
                  value={researchWeight}
                  onChange={(e) => setResearchWeight(parseFloat(e.target.value) || 0)}
                  className="h-10 text-center font-bold"
                />
                <span className="text-sm font-medium w-6">%</span>
              </div>
            </div>

            <div className="flex items-center justify-end border-t pt-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Tổng cộng:</span>
                <span className={`font-bold text-lg ${!isValid ? "text-destructive" : "text-emerald-500"}`}>
                  {totalWeight}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !isValid}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
          >
            {isPending ? "Đang lưu..." : "Lưu Trọng Số"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
