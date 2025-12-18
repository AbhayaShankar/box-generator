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
  const [isCShape, setIsCShape] = useState(false);

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
      <div className="w-full border border-white p-4 rounded-xl">
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

            <div className="flex justify-center mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={isCShape}
                  onChange={() => setIsCShape(!isCShape)}
                  className="w-4 h-4"
                />
                <span>Show C-Shape</span>
              </label>
            </div>

            {isCShape ? (
              <div className="w-full mx-auto p-4">
                {(() => {
                  const positions = getCShapePositions(boxes.length);
                  const maxRow = Math.max(...positions.map(p => p.row));
                  const boxesPerFullRow = Math.ceil(boxes.length / 3);

                  return Array.from({ length: maxRow + 1 }).map((_, row) => (
                    <div key={row} className="flex gap-2.5 mb-2.5 last:mb-0">
                      {Array.from({ length: boxesPerFullRow }).map((_, col) => {
                        const boxIndex = boxes.findIndex(box => {
                          const pos = positions[box.id];
                          return pos && pos.row === row && pos.col === col;
                        });

                        const box = boxIndex !== -1 ? boxes[boxIndex] : null;

                        if (!box) {
                          return (
                            <div
                              key={`empty-${row}-${col}`}
                              className="flex-1 aspect-square bg-transparent"
                            />
                          );
                        }

                        return (
                          <div
                            key={`${row}-${col}`}
                            onClick={() => handleBoxClick(box.id)}
                            className={`
                  flex-1 aspect-square flex items-center justify-center text-white font-bold
                  rounded-xl border-3 transition-all duration-300 ease-out
                  shadow-2xl hover:shadow-3xl active:shadow-xl
                  backdrop-blur-sm relative overflow-hidden
                  ${box.color === 'red'
                                ? 'bg-linear-to-br from-red-500 to-red-600 border-red-600/80'
                                : 'bg-linear-to-br from-green-500 to-green-600 border-green-600/80'
                              }
                  ${isResetting
                                ? 'cursor-not-allowed opacity-60 shadow-lg'
                                : 'cursor-pointer hover:scale-[1.01] hover:-translate-y-1 active:scale-[0.95]'
                              }
                  ${box.color === 'green'
                                ? 'ring-4 ring-green-400/30 shadow-green-500/50'
                                : 'shadow-red-500/40 hover:shadow-red-500/60'
                              }
                `}
                            style={{
                              boxShadow: `
                    ${box.color === 'red'
                                  ? '0 20px 40px -10px rgba(239, 68, 68, 0.6), 0 10px 20px -8px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                                  : '0 20px 40px -10px rgba(34, 197, 94, 0.6), 0 10px 20px -8px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)'
                                },
                    0 8px 32px -8px rgba(0,0,0,0.25)
                  `
                            }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-8 opacity-75" />

                            {/* Click number badge with 3D effect */}
                            {box.clickOrder > 0 && (
                              <div className={`
                    relative z-10 text-xs rounded-full w-6 h-6 flex items-center justify-center
                    shadow-lg shadow-black/50 backdrop-blur-sm border border-white/20
                    ${box.color === 'red'
                                  ? 'bg-red-700/80 shadow-red-500/30'
                                  : 'bg-green-700/80 shadow-green-500/30'
                                }
                  `}>
                                {box.clickOrder}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2.5">
                {boxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => handleBoxClick(box.id)}
                    disabled={isResetting}
                    className={`
          aspect-square w-full flex items-center justify-center text-white font-bold
          rounded-xl border-3 transition-all duration-300 ease-out
          shadow-2xl hover:shadow-3xl active:shadow-xl
          backdrop-blur-sm relative overflow-hidden
          ${box.color === 'red'
                        ? 'bg-linear-to-br from-red-500 to-red-600 border-red-600/80 shadow-red-500/40 hover:shadow-red-500/60'
                        : 'bg-linear-to-br from-green-500 to-green-600 border-green-600/80 ring-4 ring-green-400/30 shadow-green-500/50'
                      }
          ${isResetting
                        ? 'cursor-not-allowed opacity-60 shadow-lg'
                        : 'cursor-pointer hover:scale-[1.01] hover:-translate-y-1 active:scale-[0.95]'
                      }
        `}
                    style={{
                      boxShadow: `
            ${box.color === 'red'
                          ? '0 20px 40px -10px rgba(239, 68, 68, 0.6), 0 10px 20px -8px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                          : '0 20px 40px -10px rgba(34, 197, 94, 0.6), 0 10px 20px -8px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)'
                        },
            0 8px 32px -8px rgba(0,0,0,0.25)
          `
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-8 opacity-75" />

                    {box.clickOrder > 0 && (
                      <div className={`
            relative z-10 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center
            shadow-lg shadow-black/50 backdrop-blur-sm border border-white/20
            ${box.color === 'red'
                          ? 'bg-red-700/80 shadow-red-500/30'
                          : 'bg-green-700/80 shadow-green-500/30'
                        }
          `}>
                        {box.clickOrder}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}