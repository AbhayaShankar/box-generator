import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { validateInput } from '@/helper/validateInput';
import type { Box, BoxGeneratorActions, BoxGeneratorState } from '@/types/type';

export function useBoxGenerator() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [clickCounter, setClickCounter] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isCShape, setIsCShape] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBoxes([]);
    const value = e.target.value;
    setInputValue(value);
    validateInput(value, setError);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validateInput(inputValue, setError);
    if (isValid) {
      const num = parseInt(inputValue, 10);
      setBoxes(
        Array.from({ length: num }, (_, i) => ({
          id: i,
          color: 'red' as const,
          clickOrder: 0,
        })),
      );
    }
  };

  const startReverseAnimation = useCallback((currentBoxes: Box[]) => {
    setIsResetting(true);

    setTimeout(() => {
      const greenBoxes = [...currentBoxes]
        .filter((box) => box.color === 'green')
        .sort((a, b) => b.clickOrder - a.clickOrder);

      greenBoxes.forEach((box, index) => {
        setTimeout(() => {
          setBoxes((prevBoxes) =>
            prevBoxes.map((b) =>
              b.id === box.id ? { ...b, color: 'red' as const, clickOrder: 0 } : b,
            ),
          );

          if (index === greenBoxes.length - 1) {
            setTimeout(() => {
              setClickCounter(0);
              setIsResetting(false);
            }, 1000);
          }
        }, index * 1000);
      });
    }, 500);
  }, []);

  const handleBoxClick = useCallback(
    (id: number) => {
      if (isResetting) return;
      setBoxes((prevBoxes: Box[]) => {
        const boxToUpdate = prevBoxes.find((box) => box.id === id);
        if (!boxToUpdate || boxToUpdate.color === 'green') {
          return prevBoxes;
        }
        const newBoxes = prevBoxes.map<Box>((box) =>
          box.id === id
            ? { ...box, color: 'green' as const, clickOrder: clickCounter + 1 }
            : box,
        );
        const allGreen = newBoxes.every((box) => box.color === 'green');
        if (allGreen) {
          setTimeout(() => startReverseAnimation(newBoxes), 0);
        }
        return newBoxes;
      });
      setClickCounter((prev) => prev + 1);
    },
    [clickCounter, isResetting, startReverseAnimation],
  );

  const reset = useCallback(() => {
    setInputValue('');
    setError('');
    setBoxes([]);
    setClickCounter(0);
    setIsResetting(false);
  }, []);

  const toggleCShape = () => {
    setIsCShape((prev) => !prev);
  };

  const greenBoxesCount = boxes.filter((box) => box.color === 'green').length;
  const totalBoxes = boxes.length;

  const state: BoxGeneratorState = {
    inputValue,
    error,
    boxes,
    isResetting,
    isCShape,
    greenBoxesCount,
    totalBoxes,
  };

  const actions: BoxGeneratorActions = {
    handleInputChange,
    handleSubmit,
    handleBoxClick,
    reset,
    toggleCShape,
  };

  return { state, actions };
}