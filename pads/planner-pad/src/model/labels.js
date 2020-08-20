//
// Copyright 2020 DXOS.org
//

export const PLANNER_LABELS = ['red', 'yellow', 'green'];

export const toggleLabel = (currentLabels, toggledLabel) => {
  if (!currentLabels) {
    return { [toggledLabel]: true };
  }
  return { ...currentLabels, [toggledLabel]: !(currentLabels[toggledLabel] === true) };
};
