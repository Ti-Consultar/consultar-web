import { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";

interface TextCarouselProps {
  phrases: string[];
  intervalMs?: number;
}

export const TextCarousel = ({
  phrases,
  intervalMs = 4000,
}: TextCarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [phrases.length, intervalMs]);

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography
        sx={{
          color: "var(--neutral-white)",
          fontWeight: '200'
        }}
        variant="h6"
        textAlign="center"
      >
        {phrases[index]}
      </Typography>

      <Stack direction="row" spacing={1}>
        {phrases.map((_, i) => (
          <Box
            key={i}
            sx={{
              transition: "all 0.3s ease",
              width: index === i ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "var(--neutral-300)",
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
