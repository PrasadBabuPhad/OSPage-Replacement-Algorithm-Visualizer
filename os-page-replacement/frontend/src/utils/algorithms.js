export function runSimulation(pages, frameCount, algorithm) {
  const frames = [];
  const steps = [];
  let hits = 0;
  let faults = 0;

  pages.forEach((page, index) => {
    const hitIndex = frames.indexOf(page);

    if (hitIndex !== -1) {
      hits++;
      if (algorithm === "LRU") {
        frames.splice(hitIndex, 1);
        frames.push(page); // Move most recently used to end
      }
      steps.push({
        step: index + 1,
        page,
        status: "HIT",
        frames: [...frames],
        evicted: null,
        explanation: `Page ${page} is already in memory. No replacement needed (Page Hit).`,
      });
    } else {
      faults++;
      let evicted = null;
      let explanation = "";

      if (frames.length < frameCount) {
        frames.push(page);
        explanation = `Page ${page} caused a Page Fault and was loaded into an empty frame.`;
      } else {
        if (algorithm === "FIFO") {
          evicted = frames.shift();
          frames.push(page);
          explanation = `Memory full. FIFO evicted Page ${evicted} because it arrived earliest, loading Page ${page}.`;
        } else if (algorithm === "LRU") {
          evicted = frames.shift();
          frames.push(page);
          explanation = `Memory full. LRU evicted Page ${evicted} because it was used least recently, loading Page ${page}.`;
        } else if (algorithm === "OPTIMAL") {
          let farthestIndex = -1;
          let replacePos = 0;

          frames.forEach((fPage, fIdx) => {
            const nextUse = pages.slice(index + 1).indexOf(fPage);
            if (nextUse === -1) {
              farthestIndex = Infinity;
              replacePos = fIdx;
            } else if (nextUse > farthestIndex && farthestIndex !== Infinity) {
              farthestIndex = nextUse;
              replacePos = fIdx;
            }
          });

          evicted = frames[replacePos];
          frames[replacePos] = page;
          explanation = `Memory full. Optimal evicted Page ${evicted} (needed farthest in the future), loading Page ${page}.`;
        }
      }

      steps.push({
        step: index + 1,
        page,
        status: "FAULT",
        frames: [...frames],
        evicted,
        explanation,
      });
    }
  });

  return { steps, hits, faults };
}
