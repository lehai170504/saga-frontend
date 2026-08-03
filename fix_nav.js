const fs = require('fs');
const file = 'd:/GitHub/saga-frontend/src/config/navigation.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{ href: `\/student\/\$\{classId\}\/commits`[\s\S]*?label: "Biểu đồ nhiệt" \},[\s\S]*?\],[\s\S]*?\},/g, '');
content = content.replace(/\{ href: `\/student\/\$\{classId\}\/commits`[\s\S]*?label: "Nhật ký hoạt động" \},/g, '');
content = content.replace(/\/student\/settings/g, '/student/settings/integrations');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed navigation config');
