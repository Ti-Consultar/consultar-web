import { motion } from "framer-motion";
import LogoConsultarHorizontal from '../../../src/assets/icons/logo-consultar.svg';
import { LoadingContainer } from "./styles";

interface PulseLoadingProps {
    size: number;
}

export const PulseLoading = ({ size }: PulseLoadingProps) => {

    return (
        <LoadingContainer className="flex items-center justify-center w-full h-full">
            <motion.img
                src={LogoConsultarHorizontal}
                alt="Loading..."
                className="rounded-lg"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: size, height: size }}
            />
        </LoadingContainer>
    );
};