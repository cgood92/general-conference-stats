import React from "react";
import {
  ActionButton,
  ComboBox,
  Content,
  Dialog,
  DialogTrigger,
  Form,
  Heading,
  Item,
  RangeSlider,
} from "@adobe/react-spectrum";
import FilterIcon from "@spectrum-icons/workflow/Filter";
import data from "./data";
import "./filters.css";

export type FilterState = {
  speaker: string;
  years: { start: number; end: number };
};

type FiltersProps = {
  onChange: (filterState: FilterState) => void;
  value: FilterState;
};

export default function Filters({ onChange, value }: FiltersProps) {
  const isFilterActive = getIsFilterActive(value);

  return (
    <DialogTrigger
      type="popover"
      mobileType="tray"
      hideArrow
      placement="bottom right"
    >
      <ActionButton isQuiet aria-label="Filters">
        <FilterIcon />
        {isFilterActive && <Indicator />}
      </ActionButton>
      <Dialog>
        <Content>
          <Form>
            <Heading level={3} marginBottom="size-100">
              Filters
            </Heading>
            <ComboBox
              defaultItems={speakersArray}
              defaultSelectedKey={value.speaker}
              label="Speaker"
              onSelectionChange={(speaker) =>
                onChange({
                  ...value,
                  speaker: (speaker || "") as string,
                })
              }
              marginBottom="size-100"
            >
              {(speaker) => <Item key={speaker.key}>{speaker.label}</Item>}
            </ComboBox>
            <RangeSlider
              defaultValue={value.years}
              getValueLabel={(years) => `${years.start} - ${years.end}`}
              label="Years"
              minValue={minYear}
              maxValue={maxYear}
              onChangeEnd={(years) =>
                onChange({
                  ...value,
                  years,
                })
              }
              width="100%"
            />
          </Form>
        </Content>
      </Dialog>
    </DialogTrigger>
  );
}

const speakersArray = Array.from(new Set(data.map((talk) => talk.speaker)))
  .sort()
  .map((key) => ({ key: key as string, label: key as string }));
speakersArray.unshift({ key: "", label: "All Speakers" });

export const minYear = data[0].year;
export const maxYear = data.slice(-1)[0].year;

export const defaultSearchParams = {
  speaker: "",
  start: String(minYear),
  end: String(maxYear),
  searchTerms: [],
};

export function filterData(_data: typeof data, filters: FilterState) {
  return _data.filter((talk) => {
    let validSpeaker = true;

    if (filters.speaker) {
      validSpeaker = talk.speaker === filters.speaker;
    }

    const validYear =
      talk.year <= filters.years.end && talk.year >= filters.years.start;

    return validSpeaker && validYear;
  });
}

export function buildYearsArray(start: number, end: number) {
  return new Array(end - start + 1).fill(null).map((_, index) => start + index);
}

function getIsFilterActive(currentFilters: FilterState) {
  return (
    defaultSearchParams.end !== String(currentFilters.years.end) ||
    defaultSearchParams.start !== String(currentFilters.years.start) ||
    defaultSearchParams.speaker !== currentFilters.speaker
  );
}

function Indicator() {
  return <div className="indicator"></div>;
}