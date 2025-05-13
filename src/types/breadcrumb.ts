type BreadcrumbType = "group" | "company" | "subcompany";

export type Breadcrumb = {
  id: number;
  type: BreadcrumbType;
};

export type BreadcrumbItem = {
  id?: number,
  link: string,
  name: string,
  parentId?: number,
  type?: BreadcrumbType
}
