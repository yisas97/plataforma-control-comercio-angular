export interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  children?: SidebarItem[];
  permissions?: string[];
  expanded?: boolean;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}
