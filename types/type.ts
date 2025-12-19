export type Box = {
  id: number;
  color: 'red' | 'green';
  clickOrder: number;
  transitionDelay?: number;
};

export type BoxGeneratorState = {
  inputValue: string;
  error: string;
  boxes: Box[];
  isResetting: boolean;
  isCShape: boolean;
  greenBoxesCount: number;
  totalBoxes: number;
};

export type BoxGeneratorActions = {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleBoxClick: (id: number) => void;
  reset: () => void;
  toggleCShape: () => void;
};