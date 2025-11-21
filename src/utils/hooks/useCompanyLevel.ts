import { useParams } from "react-router-dom";

type CompanyLevel = "group" | "company" | "branch";

export const useCompanyLevel = () => {
    const {
        groupId,
        companyId,
        filialid,
    } = useParams<{
        groupId: string;
        companyId?: string;
        filialid?: string;
    }>();

    const ids = {
        groupId: groupId ? Number(groupId) : null,
        companyId: companyId ? Number(companyId) : null,
        filialId: filialid ? Number(filialid) : null,
    };

    // descobrir o nível atual
    let level: CompanyLevel = "group";

    if (ids.filialId) level = "branch";
    else if (ids.companyId) level = "company";
    else level = "group";

    // id principal do nível atual
    const currentId =
        level === "group"
            ? ids.groupId
            : level === "company"
                ? ids.companyId
                : ids.filialId;

    return {
        level,
        ids,
        currentId,
    };
};
