import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { BoxGeneratorActions, BoxGeneratorState } from '@/types/type';

type BoxControlProps = {
  state: BoxGeneratorState;
  actions: BoxGeneratorActions;
};

export default function BoxControl({ state, actions }: BoxControlProps) {
  const {
    inputValue,
    error,
    boxes,
    isResetting,
    greenBoxesCount,
    totalBoxes,
    isCShape,
  } = state;

  const { handleInputChange, handleSubmit, reset, toggleCShape } = actions;

  const boxesLength = boxes.length;

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter number [5-25]"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleInputChange}
              className="h-12 text-base"
              disabled={isResetting}
            />
            {error && (
              <Alert
                variant="destructive"
                className="mt-2 border-none text-red-300 tracking-wide"
              >
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
            {boxesLength > 0 && (
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

      {boxesLength > 0 && (
        <div className="w-full">
          <div className="text-center mb-4">
            <p className="text-lg font-medium">
              Clicked: {greenBoxesCount}/{totalBoxes} boxes
            </p>
            {isResetting && (
              <p className="text-sm text-muted-foreground">Resetting boxes...</p>
            )}
          </div>

          <div className="flex justify-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Input
                type="checkbox"
                checked={isCShape}
                onChange={toggleCShape}
                className="w-4 h-4"
              />
              <span>Show C-Shape</span>
            </label>
          </div>
        </div>
      )}
    </>
  );
}