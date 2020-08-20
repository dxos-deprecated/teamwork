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

export const labelColorLookup = {
  red: '#F08080',
  yellow: '#FFD700',
  green: '#9ACD32'
};

export const defaultLabelNames = {
  red: 'red',
  yellow: 'yellow',
  green: 'green'
};
