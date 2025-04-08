import { Loader, LoadingContainer, LoadingContentContainer, Text } from "./styles";

interface SpinnerLoadingProps {
    text?: string;
}

export const SpinnerLoading = ({ text }: SpinnerLoadingProps) => {

    return (
        <LoadingContainer className="flex items-center justify-center w-full h-full">
            <LoadingContentContainer>
                <Loader />
                <Text>{text}</Text>
            </LoadingContentContainer>
        </LoadingContainer>
    );
};