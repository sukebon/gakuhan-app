"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface Props {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  unit?: string;
}

export default function MeasureQuantity({
  value,
  setValue,
  min,
  max,
  label,
  unit = "",
}: Props) {
  const array = Array.from(Array(max + 1 - min), (_, i) => i + min);

  return (
    <>
      {min === max ? (
        <div className="text-sm">
          数量<span className="ml-3">{min}</span>
        </div>
      ) : (
        <div className="flex-grow">
          <Label>{label}</Label>
          <Select value={String(value)} onValueChange={(e) => setValue(+e)}>
            <SelectTrigger>
              <SelectValue
                placeholder={value !== 0 ? value + unit : "選択してください"}
              >
                {value !== 0 && value + unit}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {array.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
