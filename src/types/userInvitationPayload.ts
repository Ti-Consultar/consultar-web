export type userInvitationPayload = {
  groupId: number;
  companyId?: number;
  subCompanyId?: number;
  emailInvitedByUser: string;
  permissionId: number;
};

export type invitations = {
  invitations: userInvitationPayload[];
};
