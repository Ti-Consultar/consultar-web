import { useEffect } from "react";
import { useParams } from "react-router";
import { useMainContext } from "../../contexts/mainContext";
import { resolveBreadcrumb } from "../../services/apis/routes/breadcrumb.service";
import {
  BreadcrumbItem,
  BreadcrumbResolveResponseItem,
  BreadcrumbRouteKey,
} from "../../types/breadcrumb";

type RouteParams = {
  groupId?: string;
  companyId?: string;
  companyid?: string;
  subCompanyId?: string;
  balanceteId?: string;
};

const mapBreadcrumbItem = (
  item: BreadcrumbResolveResponseItem
): BreadcrumbItem => ({
  name: item.label,
  link: item.path ?? "",
  type: item.type,
});

export function useBreadcrumb(routeKey: BreadcrumbRouteKey) {
  const { setBreadcrumbs } = useMainContext();
  const { groupId, companyId, companyid, subCompanyId, balanceteId } =
    useParams<RouteParams>();

  useEffect(() => {
    let isMounted = true;

    const loadBreadcrumb = async () => {
      try {
        const items = await resolveBreadcrumb({
          routeKey,
          groupId,
          companyId: companyId ?? companyid,
          subCompanyId,
          balanceteId,
        });

        if (!isMounted) return;

        setBreadcrumbs(items.map(mapBreadcrumbItem));
      } catch (error) {
        console.error("Erro ao resolver breadcrumb:", error);
      }
    };

    loadBreadcrumb();

    return () => {
      isMounted = false;
    };
  }, [
    routeKey,
    groupId,
    companyId,
    companyid,
    subCompanyId,
    balanceteId,
    setBreadcrumbs,
  ]);
}
