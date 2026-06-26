# SAGA Frontend - Project-Scoped Rules (Agents)

These rules dictate the strict UI/UX guidelines and localization standards for the SAGA Frontend (Continuous Dashboard) project. You MUST always follow these rules when writing code, generating components, or assisting the user.

## 1. UI/UX & Coding Standards (Premium Feel)
- **Color System:** Use Tailwind CSS v4 `oklch` variables exclusively. NEVER hardcode HEX or RGB values. Use `bg-primary`, `text-primary`, `bg-secondary`, `bg-card`, `bg-background`, `text-destructive`, `emerald-500` (Success), `amber-500`/`orange-500` (Warning).
- **Border Radius (Glassmorphism):**
  - Buttons and Inputs: Always use `rounded-xl` or `rounded-full`.
  - Cards, Panels, Modals: Always use `rounded-2xl`, `rounded-3xl`, or `rounded-[2rem]`.
  - Avoid `rounded-md` or `rounded-lg` unless building tiny dropdown menus or small status badges.
- **Typography:**
  - Do not use custom fonts. Stick to default `font-sans`.
  - Page Headers: `text-4xl` or `text-5xl font-black tracking-tight`.
  - Card Titles: `text-base font-extrabold` or `text-lg font-bold`.
  - Notes/Small text: `text-[10px]` or `text-[11px] font-bold uppercase tracking-wide`.
- **UI Components:**
  - ALWAYS use Shadcn UI components from `@/components/ui/`. DO NOT build generic buttons or inputs from scratch using plain HTML elements.
- **Icons:**
  - ONLY use `lucide-react`. Do not use FontAwesome or Heroicons.
  - Standard size is `size={16}`.
  - Encase standalone icons in a rounded container with a soft background (e.g., `p-3 bg-primary/10 text-primary rounded-2xl`).
- **Animations:**
  - Ensure dynamic interactions. Use `animate-in fade-in slide-in-from-bottom-4 duration-500` for mounting cards/panels.
  - Hover states should always have visual feedback, e.g., `transition-all duration-300 hover:shadow-md hover:border-border`.

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
These terms must be kept in English as they are widely used by IT students:
- Task
- Workspace
- Dashboard
- Jira
- GitHub
- FAP (FPT Academic Portal)

## 3. General Conventions
- Maintain a highly aesthetic, "Premium" look and feel. 
- Avoid generic and boring layouts. Always apply proper padding (`p-6`), spacing (`gap-4`, `space-y-6`), and soft borders (`border border-border/50`).
