
export const iconMap = import.meta.glob(
  "../../../assets/icons/sidebarv2/*.svg",
  { eager: true, import: "default" }
) as Record<string, string>;
