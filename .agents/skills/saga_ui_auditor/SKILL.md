---
name: saga_ui_auditor
description: Audits and enforces SAGA Frontend UI/UX premium guidelines, Tailwind CSS standards, Glassmorphism, and Vietnamese localization terminology.
---

# SAGA UI/UX Auditor Skill

When creating, modifying, or reviewing UI components in the SAGA Frontend project, you MUST trigger this skill and apply the following strict guidelines to ensure a Premium experience.

## 1. UI/UX & Coding Standards
- **Color System:** Use Tailwind CSS v4 `oklch` variables exclusively. NEVER hardcode HEX or RGB values. Use `bg-primary`, `text-primary`, `bg-secondary`, `bg-card`, `bg-background`, `text-destructive`, `emerald-500` (Success), `amber-500`/`orange-500` (Warning).
- **Border Radius (Glassmorphism):**
  - Buttons and Inputs: Always use `rounded-xl` or `rounded-full`.
  - Cards, Panels, Modals: Always use `rounded-2xl`, `rounded-3xl`, or `rounded-[2rem]`.
  - Avoid `rounded-md` or `rounded-lg` unless building tiny dropdown menus or small status badges.
- **Typography:**
  - Do not use custom fonts. Stick to default `font-sans`.
  - Page Headers: `text-4xl` or `text-5xl font-black tracking-tight`.
  - Card Titles: `text-base font-extrabold` or `text-lg font-bold`.
- **UI Components:**
  - ALWAYS use Shadcn UI components from `@/components/ui/`. DO NOT build generic buttons or inputs from scratch.
- **Icons & Animations:**
  - ONLY use `lucide-react` (Standard size `size={16}`). Encase standalone icons in a rounded container with a soft background (e.g., `p-3 bg-primary/10 text-primary rounded-2xl`).
  - Use `animate-in fade-in slide-in-from-bottom-4 duration-500` for mounting components and `transition-all duration-300 hover:shadow-md` for interaction.

## 2. Localization & Terminology (Vietnamese)
All user-facing UI text MUST be in standard Vietnamese, with a few IT-specific exceptions.

**Strict Translations:**
- "Manual" / "Override" ➔ "Thủ công"
- "Auto-sync" ➔ "Tự động đồng bộ"
- "Settings" ➔ "Cấu hình" hoặc "Cài đặt"
- "Heatmap" ➔ "Biểu đồ nhiệt"
- "Graph" / "Node-Edge" ➔ "Mạng tương tác"
- "Success" / "Warning" / "Error" ➔ "Thành công" / "Cảnh báo" / "Lỗi"
- "Healthy" ➔ "Bình thường"
- "Loading..." / "Saving..." ➔ "Đang tải..." / "Đang lưu..."

**Exceptions (DO NOT Translate):**
- Task
- Workspace
- Dashboard
- Jira
- GitHub
- FAP (FPT Academic Portal)
