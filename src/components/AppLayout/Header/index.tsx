import { Badge, useMediaQuery } from "@mui/material";
import { useMainContext } from "../../../contexts/mainContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {
  BreadcrumbsContainer,
  BreadcrumbsItem,
  BreadcrumbsItems,
  HeaderButton,
  MainContainer,
} from "./styles";
import { useState } from "react";

export const Header = () => {
  const { breadcrumbs } = useMainContext();
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const flattenedBreadcrumbs = breadcrumbs.flat();
  const previous = flattenedBreadcrumbs.at(-2);

  return (
    <MainContainer>
      <BreadcrumbsContainer>
        {isMobile
          ? previous && (
              <BreadcrumbsItems breadcrumbActive>
                <ArrowLeftIcon fontSize="medium" />
                <BreadcrumbsItem href={previous.link} breadcrumbActive>
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
                    <BreadcrumbsItem href={item.link}>
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
