import React from "react";

export interface Project {
  id: string;
  name: string;
  group: string;
  status: string;
  progress: number;
  githubRepos: string[];
  jiraBoard: string;
}

interface ClassProjectsTabProps {
  projects: Project[];
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const JiraIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12.004 0c-2.35 2.395-2.365 6.185.133 8.585l3.412 3.413-3.197 3.198a6.501 6.501 0 0 1 1.412 7.04l9.566-9.566a.95.95 0 0 0 0-1.344L12.004 0zm-1.748 1.74L.67 11.327a.95.95 0 0 0 0 1.344C4.45 16.44 8.22 20.244 12 24c2.295-2.298 2.395-6.096-.08-8.533l-3.47-3.469 3.2-3.2c-1.918-1.955-2.363-4.725-1.394-7.057z" />
  </svg>
);

export function ClassProjectsTab({ projects }: ClassProjectsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-foreground">Danh sách Dự án (Chỉ xem)</h2>
        <div className="text-sm font-medium text-muted-foreground px-3 py-1.5 bg-muted/50 rounded-xl">
          Nội dung dự án do Giảng viên quản lý
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-primary text-xl leading-tight">{project.name}</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Thực hiện bởi: <span className="text-foreground font-bold">{project.group}</span>
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md font-bold text-xs whitespace-nowrap shrink-0 ${
                  project.status === "Hoàn thành"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-2 space-y-4">
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5" /> Repositories
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.githubRepos.map((repo, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all border border-border/50 hover:border-border"
                    >
                      <GithubIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      {repo}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                  <JiraIcon className="w-3.5 h-3.5" /> Workspace Jira
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0052CC]/10 hover:bg-[#0052CC]/15 text-[#0052CC] dark:text-[#579DFF] text-xs font-semibold transition-all border border-[#0052CC]/20 hover:border-[#0052CC]/30"
                  >
                    <JiraIcon className="w-3.5 h-3.5" />
                    {project.jiraBoard}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-auto pt-4 border-t border-border/30">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>Tiến độ hoàn thành</span>
                <span className="text-foreground">{project.progress}%</span>
              </div>
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
                    project.progress === 100 ? "bg-emerald-500" : "bg-primary"
                  }`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
