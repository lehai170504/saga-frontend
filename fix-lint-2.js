const fs = require('fs');

function fixFile(filepath, replacements) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  for (const [old, newStr] of replacements) {
    if (typeof old === 'string') {
      content = content.replace(old, newStr);
    } else {
      content = content.replace(old, newStr);
    }
  }
  fs.writeFileSync(filepath, content, 'utf8');
}

// 1. student audit-logs
fixFile('src/app/(dashboard)/student/audit-logs/page.tsx', [
  [/setSelectedClass\(cls\);/g, 'setTimeout(() => setSelectedClass(cls), 0);']
]);

// 2. student heatmap
fixFile('src/app/(dashboard)/student/heatmap/page.tsx', [
  [/setSelectedClass\(cls\);/g, 'setTimeout(() => setSelectedClass(cls), 0);']
]);

// 3. student interaction-graph
fixFile('src/app/(dashboard)/student/interaction-graph/page.tsx', [
  [/setSelectedClass\(cls\);/g, 'setTimeout(() => setSelectedClass(cls), 0);']
]);

// 4. student projects create
fixFile('src/app/(dashboard)/student/projects/create/page.tsx', [
  [/setSelectedClass\(cls\);/g, 'setTimeout(() => setSelectedClass(cls), 0);']
]);

// 5. student projects page
fixFile('src/app/(dashboard)/student/projects/page.tsx', [
  [/setSelectedClass\(cls\);/g, 'setTimeout(() => setSelectedClass(cls), 0);']
]);

// 6. admin peer-review-rules
fixFile('src/features/admin/components/evaluation-config/peer-review-rules.tsx', [
  [/"ăn bám"/g, '&quot;ăn bám&quot;'],
  [/"Zero-sum game"/g, '&quot;Zero-sum game&quot;']
]);

// 7. admin task-multiplier-templates
fixFile('src/features/admin/components/evaluation-config/task-multiplier-templates.tsx', [
  [/"Code", "Docs", "Design"/g, '&quot;Code&quot;, &quot;Docs&quot;, &quot;Design&quot;']
]);

// 8. admin data-integration-rules
fixFile('src/features/admin/components/evaluation-config/data-integration-rules.tsx', [
  [/import React, \{ useState \} from "react";/g, 'import React from "react";']
]);

// 9. admin override-requests
fixFile('src/features/admin/components/evaluation-config/override-requests.tsx', [
  [/import \{ Card, CardContent, CardDescription, CardHeader, CardTitle \} from/g, 'import { Card, CardContent } from']
]);

// 10. sidebar.tsx
fixFile('src/components/layout/sidebar.tsx', [
  [/FileText,/g, ''],
  [/AlertTriangle,/g, ''],
  [/TrendingDown,/g, ''],
  [/Clock,/g, '']
]);

console.log("Done phase 2");
