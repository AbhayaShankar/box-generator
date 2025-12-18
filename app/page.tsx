'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCShapePositions } from '@/helper/getCShape';
import { validateInput } from '@/helper/validateInput';

type Box = {
  id: number;
  color: 'red' | 'green';
  clickOrder: number;
  transitionDelay?: number;
};

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [clickCounter, setClickCounter] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoxes([]);
    const value = e.target.value;
    setInputValue(value);
    validateInput(value, setError);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateInput(inputValue, setError);
    if (isValid) {
      const num = parseInt(inputValue, 10);
      setBoxes(Array.from({ length: num }, (_, i) => ({
        id: i,
        color: 'red' as const,
        clickOrder: 0
      })));
    }
  };

  const startReverseAnimation = useCallback((boxes: Box[]) => {
    setIsResetting(true);

    // Wait for 0.5 second before starting the reverse animation
    setTimeout(() => {
      const greenBoxes = [...boxes]
        .filter(box => box.color === 'green')
        .sort((a, b) => b.clickOrder - a.clickOrder);

      greenBoxes.forEach((box, index) => {
        setTimeout(() => {
          setBoxes(prevBoxes =>
            prevBoxes.map(b =>
              b.id === box.id ? { ...b, color: 'red' as const, clickOrder: 0 } : b
            )
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

  const handleBoxClick = useCallback((id: number) => {
    if (isResetting) return;
    setBoxes((prevBoxes: Box[]) => {
      const boxToUpdate = prevBoxes.find(box => box.id === id);
      if (!boxToUpdate || boxToUpdate.color === 'green') {
        return prevBoxes;
      }
      const newBoxes = prevBoxes.map<Box>(box =>
        box.id === id
          ? { ...box, color: 'green' as const, clickOrder: clickCounter + 1 }
          : box
      );
      const allGreen = newBoxes.every(box => box.color === 'green');
      if (allGreen) {
        setTimeout(() => startReverseAnimation(newBoxes), 0);
      }
      return newBoxes;
    });
    setClickCounter(prev => prev + 1);
  }, [clickCounter, isResetting, startReverseAnimation]);

  const reset = useCallback(() => {
    setInputValue('');
    setError('');
    setBoxes([]);
    setClickCounter(0);
    setIsResetting(false);
  }, []);

  const greenBoxesCount = boxes.filter(box => box.color === 'green').length;
  const totalBoxes = boxes.length;

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Box Generator</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter number [5-25]"
                pattern='[0-9]*'
                value={inputValue}
                onChange={handleInputChange}
                className="h-12 text-base"
                disabled={isResetting}
              />
              {error && (
                <Alert variant="destructive" className="mt-2 border-none text-red-300 tracking-wide">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="lg"
                disabled={!!error || !inputValue || isResetting}
                className="flex-1 bg-white text-black"
              >
                Generate Boxes
              </Button>
              {boxes.length > 0 && (
                <Button
                  type="button"
                  onClick={reset}
                  className="flex-1 bg-black text-white border border-white"
                  disabled={isResetting}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </form>

        {boxes.length > 0 && (
          <div className="w-full">
            <div className="text-center mb-4">
              <p className="text-lg font-medium">
                Clicked: {greenBoxesCount}/{totalBoxes} boxes
              </p>
              {isResetting && <p className="text-sm text-muted-foreground">Resetting boxes...</p>}
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              {(() => {
                const positions = getCShapePositions(boxes.length);
                const maxCol = Math.max(...positions.map(p => p.col));

                return Array.from({ length: Math.max(...positions.map(p => p.row)) + 1 }).map((_, row) => (
                  <div key={row} className="flex gap-2">
                    {Array.from({ length: maxCol + 1 }).map((_, col) => {
                      const boxIndex = boxes.findIndex(box => {
                        const pos = positions[box.id];
                        return pos && pos.row === row && pos.col === col;
                      });

                      const box = boxIndex !== -1 ? boxes[boxIndex] : null;

                      return box ? (
                        <div
                          key={`${row}-${col}`}
                          onClick={() => handleBoxClick(box.id)}
                          className={`
                    w-12.5 h-12.5 gap-1.25 flex items-center justify-center text-white font-medium
                    rounded border-2 transition-colors duration-300
                    ${box.color === 'red'
                              ? 'bg-red-500 hover:bg-red-600 border-red-600'
                              : 'bg-green-500 border-green-600'}
                    ${isResetting ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
                  `}
                        >
                          {box.clickOrder > 0 && (
                            <span className="text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
                              {box.clickOrder}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div key={`empty-${row}-${col}`} className="w-12.5 h-12.5 gap-1.25" />
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}