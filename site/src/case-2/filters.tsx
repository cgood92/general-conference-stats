import React from "react";
import { ComboBox, Item, RangeSlider, View } from "@adobe/react-spectrum";
import data from "./data";

const speakers = Array.from(new Set(data.map((talk) => talk.speaker)))
  .filter(Boolean)
  .sort()
  .map((key) => ({ key, label: key }));
speakers.unshift({ key: "", label: "All Speakers" });

export const minYear = data[0].year;
export const maxYear = data.slice(-1)[0].year;

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
    <View width="15%" marginStart="auto" paddingX="size-300">
      <ComboBox
        label="Speaker"
        width="100%"
        defaultSelectedKey={value.speaker}
        defaultItems={speakers}
        onSelectionChange={(speaker) =>
          onChange({
            ...value,
            speaker: speaker as string,
          })
        }
      >
        {(speaker) => <Item key={speaker.key}>{speaker.label}</Item>}
      </ComboBox>

      <RangeSlider
        label="Years"
        marginTop="size-200"
        width="100%"
        minValue={minYear}
        maxValue={maxYear}
        defaultValue={value.years}
        getValueLabel={(years) => `${years.start} - ${years.end}`}
        onChangeEnd={(years) =>
          onChange({
            ...value,
            years,
          })
        }
      />
    </View>
  );
}
