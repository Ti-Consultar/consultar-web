import { AboutProduct } from "./components/AboutProduct";
import { MainContainer } from "./components/AboutProduct/styles";
import { HomeFooter } from "./components/HomeFooter";
import { HomeHeader } from "./components/HomeHeader";

export const Home = () => {
    return (
        <MainContainer>
          <HomeHeader />
          <AboutProduct />
          <HomeFooter />
        </MainContainer>
      );
}