import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";

const timeframes = [
  { label: "7 D", value: 7 },
  { label: "30 D", value: 30 },
  { label: "6 Mo", value: 180 },
  { label: "12 Mo", value: 365 },
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
      customDateRange.start.getFullYear() ===
      customDateRange.end.getFullYear() ? (
        `${format(customDateRange.start, "dd.MM.")} - ${format(
          customDateRange.end,
          "dd.MM.yyyy"
        )}`
      ) : (
        `${format(customDateRange.start, "dd.MM.yyyy")} - ${format(
          customDateRange.end,
          "dd.MM.yyyy"
        )}`
      )
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
        {customDateRange.start !== null && customDateRange.end !== null && (
          <StyledDeselectButton
            type="button"
            onClick={handleClearCustomDateRange}
            aria-label="Deselect"
          >
            <StyledImage
              aria-hidden="true"
              src={"/images/x-square-fill.svg"}
              alt="filter button"
              width={15}
              height={15}
            />
          </StyledDeselectButton>
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
  border-radius: 8px;
  display: flex;
  min-width: fit-content;
  align-items: center;
  height: 2.1rem;
  padding: 4px 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
  border: ${({ $active }) =>
    $active
      ? "2px solid var(--accent-color)"
      : "0.1px solid var(--dark-grey-color)"};
  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--light-bg-color)"};
`;

const StyledCustomDateButtonContainer = styled.div`
  position: relative;
`;

const StyledDatePickerContainer = styled.div`
  position: absolute;
  top: 390px;
  z-index: 1000;
  margin-top: 10px;
`;

const StyledDeselectButton = styled.button`
  border: none;
  background-color: transparent;
  z-index: 9;
  position: absolute;
  top: -8px;
  right: -12px;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
