import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ContentContainer, MainContainer } from './styles';
import { SidebarContainer } from './Sidebar/styles';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <MainContainer>
            <SidebarContainer>
                <Sidebar isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}></Sidebar>
            </SidebarContainer>
            <ContentContainer>
                {children}
            </ContentContainer>
        </MainContainer>
    )
}