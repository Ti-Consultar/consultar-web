import { useMainContext } from "../../../contexts/mainContext";
import { BreadcrumbsContainer, BreadcrumbsItem, BreadcrumbsItems, MainContainer } from "./styles";

export const Header = () => {
    const { breadcrumbs } = useMainContext();
  
    return (
      <MainContainer>
        <BreadcrumbsContainer>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <BreadcrumbsItems
                key={item.label}
                breadcrumbActive={isLast}
              >
                {item.path && !isLast ? (
                  <BreadcrumbsItem href={item.path}>{item.label}</BreadcrumbsItem>
                ) : (
                  item.label
                )}
                {!isLast && " / "}
              </BreadcrumbsItems>
            );
          })}
        </BreadcrumbsContainer>
      </MainContainer>
    );
  };
  