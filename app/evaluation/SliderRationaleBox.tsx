'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CustomSlider, SliderMax, SliderBase, sliderScaleFunction } from '@/app/comparison/[categoryId]/page';
import { NumberBox } from '../comparison/[categoryId]/NumberBox';

interface ComparisonBoxProps {
  shownValue: number
  canBeEditable?: boolean
  rationale: string
  project1: string
  project2: string
}

export function SliderBox({ shownValue, canBeEditable = false, rationale, project1, project2 }: ComparisonBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [ratio, setRatio] = useState({ value: shownValue, type: 'input' as 'slider' | 'input' });
  const [editedRationale, setEditedRationale] = useState(rationale);

  console.log(shownValue);
  useEffect(() => {
    setRatio({ value: shownValue, type: 'input' });
  }, [shownValue]);

  const convertInputValueToSlider = () => {
    if (ratio.type === 'slider') return ratio.value;
    else return (Math.sign(ratio.value) * Math.log(Math.abs(ratio.value))) / Math.log(SliderBase);
  };

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setRatio({ type: 'slider', value: newValue });
    }
  };

  const handleNumberBoxChange = (newValue: number) => {
    if (typeof newValue === 'number' && isEditing) {
      setRatio({ type: 'input', value: newValue });
    }
  };

  const displayValue
    = ratio.type === 'slider' ? Math.sign(ratio.value) * sliderScaleFunction(ratio.value, SliderBase) : ratio.value;

  return (
    <div className="grow relative h-full w-full">
      <div className="relative rounded-lg">
        <div className="relative w-full">
          <div className="absolute left-1/2 top-0 h-9 w-0 border-2 border-dashed border-primary" />
          <CustomSlider
            val={convertInputValueToSlider()}
            value={convertInputValueToSlider()}
            scale={x => sliderScaleFunction(x, SliderBase)}
            min={-1 * SliderMax}
            step={1}
            max={SliderMax}
            getAriaValueText={(value: number) => `${Math.abs(value)}`}
            valueLabelFormat={(value: number) => `${Math.abs(value)}`}
            onChange={handleChange}
            valueLabelDisplay="auto"
            disabled={!isEditing}
          />
        </div>

        <div className="mb-8 flex w-full items-center justify-between gap-4">
          <span className="flex-1 text-right text-sm">
            <span className="font-semibold max-w-24">{project1}</span>
            {' '}
            deserves
          </span>
          <div className="relative flex w-32 justify-center">
            <NumberBox
              value={displayValue || 1}
              onChange={handleNumberBoxChange}
              min={-1 * sliderScaleFunction(SliderMax, SliderBase)}
              max={sliderScaleFunction(SliderMax, SliderBase)}
            />
            <div className="absolute bottom-1 right-3 border-0 bg-transparent">x</div>
          </div>
          <span className="flex-1 text-left text-sm">
            more credit than
            {' '}
            <span className="font-semibold max-w-24">{project2}</span>
          </span>
        </div>

        <div className="flex h-full flex-col space-y-2">
          <label className="font-medium">Rationale</label>
          <textarea
            value={isEditing ? editedRationale : rationale}
            onChange={e => setEditedRationale(e.target.value)}
            disabled={!isEditing}
            cols={10}
            className="size-full min-h-[200px] grow resize-none rounded-md border border-gray-300 px-3.5 py-3 focus:border-primary focus:outline-none"
            placeholder="Enter your rationale..."
          />
        </div>

      </div>
      {isEditing
        ? (
            <div className="absolute bottom-4 right-0 mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg  border border-gray-300 px-4 py-2.5 text-gray-600"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Discard
              </button>
              <button
                className="rounded-lg bg-primary px-4  py-2.5 text-white hover:bg-primary/90"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Save changes
              </button>
            </div>
          )
        : (
            canBeEditable && (
              <button
                className="absolute bottom-4 right-4 flex flex-row gap-1.5 rounded-lg bg-primary px-4 py-2.5"
                onClick={() => setIsEditing(true)}
              >
                <Image src="/assets/images/pencil.svg" alt="pencil" width={16} height={16} />
                <div className="text-white">Edit</div>
              </button>
            )
          )}
    </div>
  );
}
