import { getCShapePositions } from '@/helper/getCShape';
import type { Box, BoxGeneratorActions, BoxGeneratorState } from '@/types/type';

type BoxCanvasProps = {
  state: BoxGeneratorState;
  actions: BoxGeneratorActions;
};

export default function BoxCanvas({ state, actions }: BoxCanvasProps) {
  const { boxes, isResetting, isCShape } = state;
  const { handleBoxClick } = actions;

  if (boxes.length === 0) return null;

  if (isCShape) {
    const positions = getCShapePositions(boxes.length);
    const maxRow = Math.max(...positions.map((p) => p.row));
    const boxesPerFullRow = Math.ceil(boxes.length / 3);

    return (
      <div className="w-full mx-auto p-4">
        {Array.from({ length: maxRow + 1 }).map((_, row) => (
          <div key={row} className="flex gap-2.5 mb-2.5 last:mb-0">
            {Array.from({ length: boxesPerFullRow }).map((_, col) => {
              const boxIndex = boxes.findIndex((box: Box) => {
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
                    : 'bg-linear-to-br from-green-500 to-green-600 border-green-600/80'}
                  ${isResetting
                    ? 'cursor-not-allowed opacity-60 shadow-lg'
                    : 'cursor-pointer hover:scale-[1.01] hover:-translate-y-1 active:scale-[0.95]'}
                  ${box.color === 'green'
                    ? 'ring-4 ring-green-400/30 shadow-green-500/50'
                    : 'shadow-red-500/40 hover:shadow-red-500/60'}
                `}
                  style={{
                    boxShadow: `
                    ${box.color === 'red'
                      ? '0 20px 40px -10px rgba(239, 68, 68, 0.6), 0 10px 20px -8px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                      : '0 20px 40px -10px rgba(34, 197, 94, 0.6), 0 10px 20px -8px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)'}
                    ,
                    0 8px 32px -8px rgba(0,0,0,0.25)
                  `,
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-8 opacity-75" />

                  {box.clickOrder > 0 && (
                    <div
                      className={`
                    relative z-10 text-xs rounded-full w-6 h-6 flex items-center justify-center
                    shadow-lg shadow-black/50 backdrop-blur-sm border border-white/20
                    ${box.color === 'red'
                      ? 'bg-red-700/80 shadow-red-500/30'
                      : 'bg-green-700/80 shadow-green-500/30'}
                  `}
                    >
                      {box.clickOrder}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5">
      {boxes.map((box: Box) => (
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
            : 'bg-linear-to-br from-green-500 to-green-600 border-green-600/80 ring-4 ring-green-400/30 shadow-green-500/50'}
          ${isResetting
            ? 'cursor-not-allowed opacity-60 shadow-lg'
            : 'cursor-pointer hover:scale-[1.01] hover:-translate-y-1 active:scale-[0.95]'}
        `}
          style={{
            boxShadow: `
            ${box.color === 'red'
              ? '0 20px 40px -10px rgba(239, 68, 68, 0.6), 0 10px 20px -8px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
              : '0 20px 40px -10px rgba(34, 197, 94, 0.6), 0 10px 20px -8px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)'}
            ,
            0 8px 32px -8px rgba(0,0,0,0.25)
          `,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-8 opacity-75" />

          {box.clickOrder > 0 && (
            <div
              className={`
            relative z-10 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center
            shadow-lg shadow-black/50 backdrop-blur-sm border border-white/20
            ${box.color === 'red'
              ? 'bg-red-700/80 shadow-red-500/30'
              : 'bg-green-700/80 shadow-green-500/30'}
          `}
            >
              {box.clickOrder}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}