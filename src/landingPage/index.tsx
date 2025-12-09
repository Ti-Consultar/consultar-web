import { AboutProduct } from "./components/AboutProduct";
import { MainContainer } from "./components/AboutProduct/styles";
import { HomeFooter } from "./components/HomeFooter";
import { HomeHeader } from "./components/HomeHeader";

const Home = () => {
    return (
        <MainContainer>
          <HomeHeader />
          <AboutProduct />
          <HomeFooter />
        </MainContainer>
      );
}

export default Home;