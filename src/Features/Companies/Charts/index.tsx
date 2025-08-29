import React, { useState } from "react";
import {
  Button,
  CarouselContainer,
  ChartWrapper,
  Dot,
  Indicators,
} from "./styles";
import { MarginChart } from "../../Dashboard/IndicesEconomicosChart";

type ProfitabilityMonth = {
  name: string;
  dateMonth: number;
  margemBruta: number;
  margemEBITDA: number;
  margemOperacional: number;
  margemNOPAT: number;
  margemLiquida: number;
};

type Props = {
  data: ProfitabilityMonth[];
};

const metrics = [
  { key: "margemBruta", label: "Margem Bruta", color: "#f39c12" },
  { key: "margemEBITDA", label: "Margem EBITDA", color: "#27ae60" },
  { key: "margemOperacional", label: "Margem Operacional", color: "#2f6bbd" },
  { key: "margemNOPAT", label: "Margem NOPAT", color: "#8e44ad" },
  { key: "margemLiquida", label: "Margem Líquida", color: "#e74c3c" },
] as const;

export const MarginCarousel: React.FC<Props> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? metrics.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === metrics.length - 1 ? 0 : prev + 1));
  };

  return (
    <CarouselContainer>
      <Button onClick={handlePrev}>‹</Button>
      <ChartWrapper>
        <MarginChart
          data={data}
          metricKey={metrics[currentIndex].key as keyof ProfitabilityMonth}
          title={metrics[currentIndex].label}
          stroke={metrics[currentIndex].color}
        />
      </ChartWrapper>

      <Button onClick={handleNext}>›</Button>

      <Indicators>
        {metrics.map((_, i) => (
          <Dot
            key={i}
            active={i === currentIndex}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};
