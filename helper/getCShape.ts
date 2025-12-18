export const getCShapePositions = (count: number) => {
  if (count < 5) {
    return Array(count).fill(0).map((_, i) => ({ row: 0, col: i }));
  }

  const positions: Array<{ row: number; col: number }> = [];
  
  // For N=5: top=2, middle=1, bottom=2
  // For N=8: top=3, middle=2, bottom=3
  const topBottomWidth = Math.ceil(count / 3); // 5→2, 8→3, 12→4, etc.
  const middleHeight = count - 2 * topBottomWidth; // 5→1, 8→2, 12→4
  
  const totalHeight = middleHeight + 2;

  // 1. Top row (cols 0 to topBottomWidth-1)
  for (let col = 0; col < topBottomWidth && positions.length < count; col++) {
    positions.push({ row: 0, col });
  }

  // 2. Middle rows (only col 0, rows 1 to totalHeight-2)
  for (let row = 1; row < totalHeight - 1 && positions.length < count; row++) {
    positions.push({ row, col: 0 });
  }

  // 3. Bottom row (cols 0 to topBottomWidth-1)
  for (let col = 0; col < topBottomWidth && positions.length < count; col++) {
    positions.push({ row: totalHeight - 1, col });
  }

  return positions.slice(0, count);
};
