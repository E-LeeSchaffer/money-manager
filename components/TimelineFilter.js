import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

const timeframes = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "Half Year", value: 180 },
  { label: "Full Year", value: 365 },
];

export default function TimelineFilter({
  selectedTimeframe,
  onTimeframeChange,
  customDateRange,
  onCustomDateChange,
  isCustomDatePickerOpen,
  setIsCustomDatePickerOpen,
}) {
  function handleClearCustomDateRange() {
    onCustomDateChange({ start: null, end: null });
    onTimeframeChange(null);
    setIsCustomDatePickerOpen(false);
  }

  const customDateLabel =
    customDateRange.start && customDateRange.end ? (
      `${customDateRange.start.toLocaleDateString()} - ${customDateRange.end.toLocaleDateString()}`
    ) : (
      <Image
        src="/images/calendar-week.svg"
        alt="Calendar Icon"
        width={16}
        height={16}
      />
    );

  return (
    <StyledTimelineFilterContainer>
      {timeframes.map((timeframe) => (
        <StyledTimelineFilterButton
          key={timeframe.value}
          $active={selectedTimeframe === timeframe.value}
          onClick={() =>
            onTimeframeChange(
              selectedTimeframe === timeframe.value ? null : timeframe.value
            )
          }
        >
          {timeframe.label}
        </StyledTimelineFilterButton>
      ))}

      <StyledCustomDateButtonContainer>
        <StyledTimelineFilterButton
          $active={Boolean(customDateRange.start && customDateRange.end)}
          onClick={() => setIsCustomDatePickerOpen(!isCustomDatePickerOpen)}
        >
          {customDateLabel}
        </StyledTimelineFilterButton>
        {!(customDateRange.start === null && customDateRange.end === null) && (
          <StyledClearButton
            onClick={handleClearCustomDateRange}
            aria-label="Clear custom date range"
          >
            &times;
          </StyledClearButton>
        )}
      </StyledCustomDateButtonContainer>

      {isCustomDatePickerOpen && (
        <StyledDatePickerContainer>
          <DatePicker
            selected={customDateRange.start}
            onChange={onCustomDateChange}
            startDate={customDateRange.start}
            endDate={customDateRange.end}
            selectsRange
            inline
          />
        </StyledDatePickerContainer>
      )}
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
  height: 1.6rem;
  padding: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
  border: ${({ $active }) =>
    $active
      ? "2px solid var(--accent-color)"
      : "0.1px solid var(--dark-grey-color)"};
  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--light-bg-color)"};
`;

const StyledClearButton = styled.button`
  position: absolute;
  border-radius: 50%;
  right: -4px;
  top: -6px;
  border: none;
  background-color: black;
  color: var(--dark-grey-color);
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 9999;
`;

const StyledDatePickerContainer = styled.div`
  position: absolute;
  z-index: 1000;
  margin-top: 10px;
`;

const StyledCustomDateButtonContainer = styled.div`
  position: relative;
`;
