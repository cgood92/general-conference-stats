import React from "react";
import { ComboBox, Flex, Item, RangeSlider } from "@adobe/react-spectrum";
import data, { speakers } from "./data";

export type FilterState = {
  speaker: string;
  years: { start: number; end: number };
};

type FiltersProps = {
  onChange: (filterState: FilterState) => void;
  value: FilterState;
};

export default function Filters({ onChange, value }: FiltersProps) {
  return (
    <Flex
      alignItems={{ base: "end", L: "start" }}
      direction={{ base: "row", L: "column" }}
      gap="size-300"
      marginStart="auto"
      marginX={{ base: "0", L: "size-300" }}
      width={{ base: "100%", L: "15%" }}
    >
      <ComboBox
        defaultItems={speakersArray}
        defaultSelectedKey={value.speaker}
        label="Speaker"
        onSelectionChange={(speaker) =>
          onChange({
            ...value,
            speaker: speaker as string,
          })
        }
        width={{ base: "0", L: "100%" }}
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
        width={{ base: "0", L: "100%" }}
      />
    </Flex>
  );
}

const speakersArray = Object.values(speakers)
  // TODO: we shouldn't have any without speakers...
  .filter(Boolean)
  .sort()
  .map((key) => ({ key: key as string, label: key as string }));
speakersArray.unshift({ key: "", label: "All Speakers" });

export const minYear = data[0].year;
export const maxYear = data.slice(-1)[0].year;

export function filterData(_data: typeof data, filters: FilterState) {
  return _data.filter((talk) => {
    let validSpeaker = true;

    if (filters.speaker) {
      validSpeaker = talk.speaker === filters.speaker;
    }

    const validYear =
      talk.year <= filters.years.end && talk.year >= filters.years.start;

    // TODO: Shouldn't need to filter content here, should always be available
    return validSpeaker && validYear && talk.content;
  });
}

export function buildYearsArray(start: number, end: number) {
  return new Array(end - start + 1).fill(null).map((_, index) => start + index);
}