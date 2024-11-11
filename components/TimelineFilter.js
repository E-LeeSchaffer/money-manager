import styled from "styled-components";

const timeframes = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "Half Year", value: 180 },
  { label: "Full Year", value: 365 },
];

export default function TimelineFilter({
  selectedTimeframe,
  onTimeframeChange,
}) {
  function handleTimeframeClick(value) {
    if (selectedTimeframe === value) {
      onTimeframeChange(null);
    } else {
      onTimeframeChange(value);
    }
  }
  return (
    <StyledTimelineFilterContainer>
      {timeframes.map((timeframe) => (
        <StyledTimelineFilterButton
          key={timeframe.value}
          $active={selectedTimeframe === timeframe.value}
          onClick={() => handleTimeframeClick(timeframe.value)}
        >
          {timeframe.label}
        </StyledTimelineFilterButton>
      ))}
    </StyledTimelineFilterContainer>
  );
}

const StyledTimelineFilterContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const StyledTimelineFilterButton = styled.button`
  border: 0.1px solid var(--dark-grey-color);
  border-radius: 14px;
  display: flex;
  width: fit-content;
  align-items: center;
  height: 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
  border: ${({ $active }) =>
    $active
      ? "2px solid var(--accent-color)"
      : "0.1px solid var(--dark-grey-color)"};
  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--light-bg-color)"};
`;
