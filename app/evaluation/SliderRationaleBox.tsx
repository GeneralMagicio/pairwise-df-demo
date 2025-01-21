'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CustomSlider, sliderScaleFunction } from '@/app/comparison/[categoryId]/SliderComponent';
import { NumberBox } from '../comparison/[categoryId]/NumberBox';
import { IProjectRationale } from './useProjects';

import { SliderBase, SliderMax } from '@/app/comparison/[categoryId]/constant';
interface ComparisonBoxProps {
  shownValue: number
  canBeEditable?: boolean
  rationale: string
  project1: IProjectRationale
  project2: IProjectRationale
  handleVote: (rationale: string, project1Id: number, project2Id: number, shownValue: number) => void
}

export function SliderBox({
  shownValue,
  canBeEditable = false,
  rationale,
  project1,
  project2,
  handleVote }: ComparisonBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [ratio, setRatio] = useState({ value: shownValue, type: 'input' as 'slider' | 'input' });
  const [editedRationale, setEditedRationale] = useState(rationale);
  const [rationaleError, setRationaleError] = useState<string | null>(null);

  useEffect(() => {
    setRatio({ value: shownValue, type: 'input' });
    setEditedRationale(rationale);
  }, [shownValue, rationale]);

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
    <div className="relative size-full grow">
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

        <div className="mb-8 mt-2 flex w-full items-center justify-between gap-4">
          <span className="flex-1 text-right text-sm">
            <span className="max-w-24 font-semibold">{project1.name}</span>
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
            <span className="max-w-24 font-semibold">{project2.name}</span>
          </span>
        </div>

        <div className="relative flex h-full flex-col space-y-2">
          <label className="font-medium">Rationale</label>
          <textarea
            value={isEditing ? editedRationale : rationale}
            onChange={e => setEditedRationale(e.target.value)}
            onClick={() => setRationaleError(null)}
            disabled={!isEditing}
            cols={10}
            className={`min-h-48 w-full resize-none rounded-md border ${rationaleError ? 'border-red-500' : 'border-[#D0D5DD]'} p-2 shadow-sm focus:outline-none`}
            placeholder="Enter your rationale..."
          />

          <span className="mt absolute bottom-0 translate-y-full py-1 text-sm text-red-500">
            {' '}
            {rationaleError ? rationaleError : ''}
            {' '}
          </span>
        </div>

      </div>
      {isEditing
        ? (
            <div className="absolute -bottom-20 right-0 mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg  border border-gray-300 px-4 py-2.5 text-gray-600"
                onClick={() => {
                  setIsEditing(false);
                  setEditedRationale(rationale);
                  setRatio({ value: shownValue, type: 'input' });
                }}
              >
                Discard
              </button>
              <button
                className="rounded-lg bg-primary px-4  py-2.5 text-white hover:bg-primary/90"
                onClick={() => {
                  setIsEditing(false);
                  if (editedRationale === null || editedRationale.trim().length < 70) {
                    setRationaleError('Min 70 characters required');
                    return;
                  }
                  handleVote(editedRationale,
                    project1.id,
                    project2.id,
                    ratio.type === 'slider' ? Math.sign(ratio.value) * sliderScaleFunction(ratio.value, SliderBase) : ratio.value
                  );
                }}
              >
                Save changes
              </button>
            </div>
          )
        : (
            canBeEditable && (
              <button
                className="absolute -bottom-20 right-4 flex flex-row gap-1.5 rounded-lg bg-primary px-4 py-2.5"
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
