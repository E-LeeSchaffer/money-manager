import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import Backdrop from "./Backdrop";

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
      <StyledImage
        src="/images/calendar-week.svg"
        alt="Calendar Icon"
        width={16}
        height={16}
      />
    );

  return (
    <>
      {isCustomDatePickerOpen && (
        <Backdrop closeSelection={() => setIsCustomDatePickerOpen(false)} />
      )}
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

        <>
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
        </>

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
    </>
  );
}

const StyledTimelineFilterContainer = styled.div`
  display: flex;
  gap: var(--gap-sm);
  position: relative;
`;

const StyledTimelineFilterButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: var(--border-brand);
  border-radius: 8px;
  min-width: fit-content;
  font-size: var(--font-size-xs);
  line-height: 1.4;
  height: 32px;
  padding: 4px 6px;
  box-shadow: var(--shadow-brand);
  outline: var(--border-brand);
  background-color: ${({ $active }) =>
    $active ? "var(--dark-grey-color)" : "var(--white-bg-color)"};
`;

const StyledDatePickerContainer = styled.div`
  position: absolute;
  top: 26px;
  z-index: 100;
  margin-top: 10px;
`;

const StyledDeselectButton = styled.button`
  background-color: transparent;
  position: relative;
  top: -15px;
  right: 15px;
  z-index: 200;
`;

const StyledImage = styled(Image)`
  display: flex;
`;
