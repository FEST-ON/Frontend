import type { ComponentType } from "react";
import { LayoutDashboard, Users2, Ticket, Sparkles, Leaf, History, FileCheck2 } from "lucide-react";

export type AdminRole = "SUPER_ADMIN" | "FESTIVAL_MANAGER" | "FIELD_OPERATOR" | "MERCHANT" | "REVIEWER";

export const ADMIN_ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "최고 관리자",
  FESTIVAL_MANAGER: "축제 담당자",
  FIELD_OPERATOR: "현장 운영자",
  MERCHANT: "입점업체",
  REVIEWER: "검수자",
};

export interface AdminNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  roles: AdminRole[];
}

/**
 * 백엔드가 화면 단위 권한 매트릭스를 별도로 내려주지 않아, 역할 정의(SUPER_ADMIN/FESTIVAL_MANAGER/
 * FIELD_OPERATOR/MERCHANT/REVIEWER)를 근거로 이 화면에서 합리적으로 추정한 매핑입니다.
 * 실제 조직 운영 방식과 다르면 roles 배열만 조정하면 됩니다.
 */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "운영 대시보드", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER", "FIELD_OPERATOR", "REVIEWER"] },
  { href: "/admin/programs", label: "통합 운영관리", icon: Users2, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER", "FIELD_OPERATOR"] },
  { href: "/admin/content", label: "검수·게시 관리", icon: FileCheck2, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER"] },
  { href: "/admin/tickets", label: "민원·공지·사고", icon: Ticket, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER", "FIELD_OPERATOR"] },
  { href: "/admin/ai-insights", label: "AI 민원 인사이트", icon: Sparkles, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER"] },
  { href: "/admin/esg", label: "ESG 성과관리", icon: Leaf, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER"] },
  { href: "/admin/audit-logs", label: "감사 로그", icon: History, roles: ["SUPER_ADMIN", "FESTIVAL_MANAGER"] },
];

export function findNavItem(pathname: string) {
  return ADMIN_NAV_ITEMS.find((item) => (item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)));
}

export function canAccessPath(role: string | undefined, pathname: string) {
  const item = findNavItem(pathname);
  if (!item) return true;
  if (!role) return false;
  return (item.roles as string[]).includes(role);
}

export function visibleNavItems(role: string | undefined) {
  return ADMIN_NAV_ITEMS.filter((item) => role !== undefined && (item.roles as string[]).includes(role));
}
