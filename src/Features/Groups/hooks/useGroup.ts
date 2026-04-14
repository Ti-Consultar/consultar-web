import { useState } from "react";
import { getAllGroups, getDeletedGroups } from "../../../services/apis/routes/groups.service";
import { useLoading } from "../../../contexts/LoadingProvider";

export const useGroups = () => {
  const { setLoading } = useLoading();

  const [groupList, setGroupList] = useState<any[]>([]);
  const [deletedGroups, setDeletedGroups] = useState<any[]>([]);

  const fetchGroups = async () => {
    setLoading(true, "Carregando grupos...");
    try {
      const res = await getAllGroups();
      setGroupList(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeleted = async () => {
    const res = await getDeletedGroups();
    setDeletedGroups(
      res.data.map((item: any) => ({
        id: item.groupId,
        nome: item.businessEntity.nomeFantasia || item.companyName,
        cnpj: item.businessEntity.cnpj,
      }))
    );
  };

  const refetch = () => {
    fetchGroups();
    fetchDeleted();
  };

  return {
    groupList,
    deletedGroups,
    refetch,
  };
};