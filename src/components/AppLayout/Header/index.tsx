import { useMainContext } from "../../../contexts/mainContext";
import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  BreadcrumbsItems,
  MainContainer,
} from "./styles";

export const Header = () => {
  const { breadcrumbs } = useMainContext();
  return (
    <MainContainer>
      <BreadcrumbsContainer>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <BreadcrumbsItems key={item.id} breadcrumbActive={isLast}>
              {item.link && !isLast ? (
                <BreadcrumbsItem href={item.link}>{item.name}</BreadcrumbsItem>
              ) : (
                item.name
              )}
              {!isLast && " / "}
            </BreadcrumbsItems>
          );
        })}
      </BreadcrumbsContainer>
    </MainContainer>
  );
};
