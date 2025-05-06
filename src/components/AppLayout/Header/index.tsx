import { useMainContext } from "../../../contexts/mainContext";
import { BreadcrumbsContainer, BreadcrumbsItem, MainContainer } from "./styles";

export const Header = () => {
    const { breadcrumbs } = useMainContext();
  
    return (
      <MainContainer>
        <BreadcrumbsContainer>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <BreadcrumbsItem
                key={item.label}
                breadcrumbActive={isLast}
              >
                {item.path && !isLast ? (
                  <a href={item.path}>{item.label}</a>
                ) : (
                  item.label
                )}
                {!isLast && " / "}
              </BreadcrumbsItem>
            );
          })}
        </BreadcrumbsContainer>
      </MainContainer>
    );
  };
  