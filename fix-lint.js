const fs = require('fs');

function fixFile(filepath, replacements) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  for (const [old, newStr] of replacements) {
    content = content.replace(old, newStr);
    content = content.replace(old, newStr); // run again just in case
  }
  fs.writeFileSync(filepath, content, 'utf8');
}

// 1. ai-warning-rules.tsx
fixFile('src/features/admin/components/evaluation-config/ai-warning-rules.tsx', [
  [/"Gánh Team"/g, '&quot;Gánh Team&quot;'],
  [/"Ghosting"/g, '&quot;Ghosting&quot;']
]);

// 2. data-integration-rules.tsx
fixFile('src/features/admin/components/evaluation-config/data-integration-rules.tsx', [
  [/"Ghosting"/g, '&quot;Ghosting&quot;'],
  [/"Công việc luôn tự mở rộng ra để lấp đầy thời gian được ấn định cho nó"/g, '&quot;Công việc luôn tự mở rộng ra để lấp đầy thời gian được ấn định cho nó&quot;'],
  [/"Trust, but verify"/g, '&quot;Trust, but verify&quot;'],
  [/"ngâm task"/g, '&quot;ngâm task&quot;'],
  [/"Done"/g, '&quot;Done&quot;'],
  [/useState, /g, '']
]);

// 3. peer-review-rules.tsx
fixFile('src/features/admin/components/evaluation-config/peer-review-rules.tsx', [
  [/"Freerider"/g, '&quot;Freerider&quot;']
]);

// 4. task-multiplier-templates.tsx
fixFile('src/features/admin/components/evaluation-config/task-multiplier-templates.tsx', [
  [/"Ghi đè"/g, '&quot;Ghi đè&quot;'],
  [/"Ghosting"/g, '&quot;Ghosting&quot;'],
  [/"Bộ khung SE chuẩn"/g, '&quot;Bộ khung SE chuẩn&quot;'],
  [/"Code", "Docs", "Design"/g, '&quot;Code&quot;, &quot;Docs&quot;, &quot;Design&quot;']
]);

// 5. policy-overrides.tsx
fixFile('src/features/lecturer/components/evaluation-config/policy-overrides.tsx', [
  [/"Ghi đè"/g, '&quot;Ghi đè&quot;']
]);

// 6. users/page.tsx
fixFile('src/app/(dashboard)/admin/users/page.tsx', [
  [/CheckCircle2, /g, '']
]);

// 7. sidebar
fixFile('src/components/layout/sidebar.tsx', [
  [/FileText, /g, ''],
  [/AlertTriangle, /g, ''],
  [/TrendingDown, /g, ''],
  [/Clock, /g, '']
]);

// 8. audit-logs
fixFile('src/app/(dashboard)/student/audit-logs/page.tsx', [
  [/Clock, /g, ''],
  [/const \[selectedSemester, setSelectedSemester\] = useState\(""\);\n/g, ''],
  [/setSelectedSemester\(sem\);/g, ''],
  [/setMounted\(true\);/g, 'setTimeout(() => setMounted(true), 0);']
]);

// 9. heatmap
fixFile('src/app/(dashboard)/student/heatmap/page.tsx', [
  [/Activity, /g, ''],
  [/const \[selectedSemester, setSelectedSemester\] = useState\(""\);\n/g, ''],
  [/setSelectedSemester\(sem\);/g, ''],
  [/setMounted\(true\);/g, 'setTimeout(() => setMounted(true), 0);'],
  [/\}, \[\]\);/g, '}, [subjectsData]);']
]);

// 10. interaction-graph
fixFile('src/app/(dashboard)/student/interaction-graph/page.tsx', [
  [/Share2, /g, ''],
  [/Sparkles, /g, ''],
  [/const \[selectedSemester, setSelectedSemester\] = useState\(""\);\n/g, ''],
  [/setSelectedSemester\(sem\);/g, ''],
  [/setMounted\(true\);/g, 'setTimeout(() => setMounted(true), 0);']
]);

// 11. projects create
fixFile('src/app/(dashboard)/student/projects/create/page.tsx', [
  [/CardContent, /g, ''],
  [/CardHeader, /g, ''],
  [/CardTitle, /g, ''],
  [/ExternalLink, /g, ''],
  [/const newAuditLog/g, '// const newAuditLog'],
  [/const \[selectedSemester, setSelectedSemester\] = useState\(""\);\n/g, ''],
  [/setSelectedSemester\(sem\);/g, ''],
  [/setMounted\(true\);/g, 'setTimeout(() => setMounted(true), 0);']
]);

// 12. projects page
fixFile('src/app/(dashboard)/student/projects/page.tsx', [
  [/CardContent, /g, ''],
  [/Users, /g, ''],
  [/Star, /g, ''],
  [/CheckCircle2, /g, ''],
  [/Bookmark, /g, ''],
  [/const \[selectedSemester, setSelectedSemester\] = useState\(""\);\n/g, ''],
  [/setSelectedSemester\(sem\);/g, ''],
  [/setMounted\(true\);/g, 'setTimeout(() => setMounted(true), 0);']
]);

// 13. override-requests
fixFile('src/features/admin/components/evaluation-config/override-requests.tsx', [
  [/CardDescription, /g, ''],
  [/CardHeader, /g, ''],
  [/CardTitle, /g, '']
]);

// 14. team-evaluation
fixFile('src/features/lecturer/components/project-detail/team-evaluation.tsx', [
  [/any/g, 'unknown']
]);

console.log("Done");
