export const combineGroups = (groupList: any[], deletedGroups: any[]) => {
    const active = groupList.map((g) => ({
        ...g,
        isDeleted: false,
    }));

    const deleted = deletedGroups.map((g) => ({
        id: g.id,
        groupName: g.nome,
        businessEntity: {
            nomeFantasia: g.nome,
            razaoSocial: "",
        },
        isDeleted: true,
    }));

    return [...active, ...deleted];
};
