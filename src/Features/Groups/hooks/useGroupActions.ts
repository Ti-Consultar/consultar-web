import { toast } from "sonner";
import { useLoading } from "../../../contexts/LoadingProvider";
import { deleteGroup, getGroupById, restoreGroups, saveGroup, updateGroup } from "../../../services/apis/routes/groups.service";
import { GroupFormData } from "../../../types/group";

export const useGroupActions = ({
    refetch,
    setOpen,
    setEditingGroup,
    setOpenDialog,
    setSelectedGroupId,
    setOpenInvitationModal,
    setGroupToBeInvited,
    setDeletedGroups
}: any) => {
    const { setLoading } = useLoading();

    const handleSubmit = async (
        data: GroupFormData,
        editingGroup?: GroupFormData,
        resetForm?: () => void
    ) => {
        setLoading(true, editingGroup ? "Atualizando..." : "Salvando...");

        try {
            const response = editingGroup?.groupId
                ? await updateGroup(editingGroup.groupId, data)
                : await saveGroup(data);

            if (!response.success) return;

            toast.success(
                editingGroup ? "Grupo atualizado!" : "Grupo criado!"
            );

            setOpen(false);
            setEditingGroup(undefined);
            resetForm?.();
            refetch();
        } catch {
            toast.error("Erro ao salvar grupo");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const res = await getGroupById(id);
            setEditingGroup(res.data);
            setOpen(true);
        } catch {
            toast.error("Erro ao carregar grupo");
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true, "Deletando...");
        try {
            await deleteGroup(id);
            toast.success("Grupo deletado!");
            refetch();
        } catch {
            toast.error("Erro ao deletar");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async (selectedId: number | null) => {
        if (!selectedId) return;
        await handleDelete(selectedId);
        setSelectedGroupId(null);
        setOpenDialog(false);
    };

    const handleOpenInvite = (groupId: number) => {
        setGroupToBeInvited(groupId);
        setOpenInvitationModal(true);
    };

    const handleReactivate = async (selectedIds: number[]) => {
        try {
            setLoading(true, "Reativando empresas...");

            await restoreGroups(selectedIds);

            if (setDeletedGroups) {
                setDeletedGroups((prev: any[]) =>
                    prev.filter((c) => !selectedIds.includes(c.id))
                );
            }

            toast.success("Empresas / marcas reativadas com sucesso!");

            refetch();
        } catch {
            toast.error("Erro ao reativar empresas");
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubmit,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        handleOpenInvite,
        handleReactivate
    };
};
