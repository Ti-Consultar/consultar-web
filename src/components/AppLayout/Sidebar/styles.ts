import styled from 'styled-components';

interface MainTemplateStyledProps {
  isOpen?: boolean;
  selected?: boolean;
}

export const SidebarContainer = styled.div<MainTemplateStyledProps>`
  background-color: #333;
  background: var(--neutral-white);
  max-height: 100vh;
  transition: width 0.3s;
  width: ${({ isOpen }) => (isOpen ? '200px' : '82px')};
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;

  img {
    width: 44px;
  }
`;

export const ListNavItem = styled.div<MainTemplateStyledProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 100vh;
  padding: 0 8px;

  .items-footer {
    margin-bottom: 24px;
  }

  .line-divisor {
    background-color: var(--neutral-200);
    height: 2px;
    margin: 0 10px;
  }
`;

export const NavItem = styled.div<MainTemplateStyledProps>`
  align-items: center;
  background-color: ${({ selected }) =>
    selected && 'var(--branding-default-blue)'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: ${({ isOpen }) => !isOpen && 'center'};
  margin: 8px 0;
  padding: 8px;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background-color: var(--branding-default-blue);

    .item-icon,
    .item-title {
      color: var(--neutral-white);
    }
  }

  .icon-perfil {
    align-items: center;
    background-color: var(--branding-default-blue);
    border-radius: 8px;
    display: flex;
    height: 45px;
    justify-content: center;
    margin-right: ${(props) => (props.isOpen ? '16px' : '0')};
    width: 45px;

    p {
      color: var(--neutral-white);
      font-weight: var(--fontWeightBold);
    }
  }
`;

export const ProfileItem = styled.button<MainTemplateStyledProps>`
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: ${({ isOpen }) => !isOpen && 'center'};
  margin: 8px 0;
  padding: 8px;
  text-decoration: none;
  transition: all 0.3s;
  width: 100%;

  &:hover {
    .item-title {
      color: var(--branding-default-blue);
    }
  }

  .icon-perfil,
  .icon-company {
    align-items: center;
    background-color: var(--branding-default-blue);
    border-radius: 8px;
    display: flex;
    height: 45px;
    justify-content: center;
    margin-right: ${(props) => (props.isOpen ? '16px' : '0')};
    width: 45px;

    p {
      color: var(--neutral-white);
      font-weight: var(--fontWeightBold);
    }
  }

  .icon-company {
    color: var(--neutral-white);
  }

  .item-title {
    font-size: 16px;
    max-width: 105px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Icon = styled.div<MainTemplateStyledProps>`
  align-items: center;
  border-radius: 8px;
  color: ${({ selected }) =>
    selected ? 'var(--neutral-white)' : 'var(--neutral-black)'};
  display: flex;
  font-size: 24px;
  justify-content: center;
  padding: 8px;
  margin-right: ${(props) => (props.isOpen ? '16px' : '0')};
`;

export const Title = styled.span<MainTemplateStyledProps>`
  color: ${({ selected }) =>
    selected ? 'var(--neutral-white)' : 'var(--neutral-black)'};
  display: ${({ isOpen }) => (isOpen ? 'inline' : 'none')};
`;

export const ButtonDrawer = styled.button<MainTemplateStyledProps>`
  align-items: center;
  background-color: var(--branding-default-blue);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-left: ${({ isOpen }) => (isOpen ? '186px' : '68px')};
  margin-top: -24px;
  padding: 4px;
  position: absolute;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: filter 0.2s, transform 0.3s, margin 0.3s;

  &:hover {
    filter: brightness(0.7);
  }
`;
