import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../../contexts/mainContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  BreadcrumbsItems,
  MainContainer,
} from "./styles";

export const Header = () => {
  const { breadcrumbs } = useMainContext();
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const flattenedBreadcrumbs = breadcrumbs.flat();
  const previous = flattenedBreadcrumbs.at(-2);

  const handleBreadcrumbClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => {
    event.preventDefault();
    navigate(link);
  };

  return (
    <MainContainer>
      <BreadcrumbsContainer>
        {isMobile
          ? previous && (
              <BreadcrumbsItems breadcrumbActive>
                <ArrowLeftIcon fontSize="medium" />
                <BreadcrumbsItem
                  href={previous.link}
                  onClick={(event) =>
                    handleBreadcrumbClick(event, previous.link)
                  }
                  breadcrumbActive
                >
                  {previous.name}
                </BreadcrumbsItem>
              </BreadcrumbsItems>
            )
          : flattenedBreadcrumbs.map((item, index) => {
              const isLast = index === flattenedBreadcrumbs.length - 1;
              return (
                <BreadcrumbsItems
                  key={item.id || item.name}
                  breadcrumbActive={isLast}
                >
                  {item.link && !isLast ? (
                    <BreadcrumbsItem
                      href={item.link}
                      onClick={(event) =>
                        handleBreadcrumbClick(event, item.link)
                      }
                    >
                      {item.name}
                    </BreadcrumbsItem>
                  ) : (
                    item.name
                  )}
                  {!isLast && <div style={{ marginLeft: "0.5rem" }}>/</div>}
                </BreadcrumbsItems>
              );
            })}
      </BreadcrumbsContainer>
    </MainContainer>
  );
};
