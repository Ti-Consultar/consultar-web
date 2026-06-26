import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../../contexts/mainContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
  const mobilePrevious = previous?.link ? previous : undefined;

  const handleBreadcrumbClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: string,
  ) => {
    event.preventDefault();
    navigate(link);
  };

  const renderBreadcrumbContent = (
    item: (typeof flattenedBreadcrumbs)[number],
    index: number,
  ) => {
    const isFirst = index === 0;

    if (isFirst && item.name === "Grupos") {
      return <HomeRoundedIcon sx={{mb: -0.5}} />;
    }

    return item.name;
  };

  return (
    <MainContainer>
      <BreadcrumbsContainer>
        {isMobile
          ? mobilePrevious && (
              <BreadcrumbsItems breadcrumbActive>
                <ArrowLeftIcon fontSize="medium" />
                <BreadcrumbsItem
                  href={mobilePrevious.link}
                  onClick={(event) =>
                    handleBreadcrumbClick(event, mobilePrevious.link)
                  }
                  breadcrumbActive
                >
                  {mobilePrevious.name}
                </BreadcrumbsItem>
              </BreadcrumbsItems>
            )
          : flattenedBreadcrumbs.map((item, index) => {
              const isLast = index === flattenedBreadcrumbs.length - 1;
              const isFirst = index === 0;
              const isHomeBreadcrumb = isFirst && item.name === "Grupos";

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
                      aria-label={isHomeBreadcrumb ? "Grupos" : undefined}
                    >
                      {renderBreadcrumbContent(item, index)}
                    </BreadcrumbsItem>
                  ) : (
                    renderBreadcrumbContent(item, index)
                  )}

                  {!isLast && (
                    <ArrowForwardIosIcon
                      fontSize="small"
                      style={{ marginLeft: "0.5rem" }}
                    />
                  )}
                </BreadcrumbsItems>
              );
            })}
      </BreadcrumbsContainer>
    </MainContainer>
  );
};