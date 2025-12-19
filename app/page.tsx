"use client";

import BoxCanvas from '@/components/BoxCanvas';
import BoxControl from '@/components/BoxControl';
import { useBoxGenerator } from '@/hooks/useBoxGenerator';

export default function Home() {
  const { state, actions } = useBoxGenerator();

  return (
    <main className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full border border-white p-4 rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Box Generator</h1>
        <BoxControl
          state={state}
          actions={actions}
        />
        {state.boxes.length > 0 && <BoxCanvas state={state} actions={actions} />}
      </div>
    </main>
  );
}