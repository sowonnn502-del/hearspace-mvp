import {
  spaceMemoryTaxonomy,
  type SpaceMemoryType,
} from "@/lib/space-memory-taxonomy";
import {
  tokenize,
  uniqueStrings,
  type NormalizedMusicContext,
} from "@/lib/visual-grounding";

export function routeSpaceMemoryType(context: NormalizedMusicContext): SpaceMemoryType[] {
  const contextTokensList = contextTokens(context);
  const contextText = contextTokensList.join(" ");
  const routed = spaceMemoryTaxonomy
    .map((category) => ({
      id: category.id,
      score: weightedOverlap(contextTokensList, [
        ...category.triggers,
        ...category.emotions,
      ]),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ id }) => id);

  if (
    /花园|玫瑰|花瓣|粉色|柔光|裙子|写真|人像|少女感|flower|portrait|pink/.test(contextText) &&
    !context.culturalSignals.length
  ) {
    return uniqueStrings([
      "flower_dream_portrait",
      ...routed.filter((id) => id !== "chinese_garden_water"),
      "unknown_soft_memory",
    ]) as SpaceMemoryType[];
  }

  if (!context.culturalSignals.length) {
    return uniqueStrings([
      ...routed.filter((id) => id !== "chinese_garden_water"),
      "unknown_soft_memory",
    ]) as SpaceMemoryType[];
  }

  return routed.length ? routed : ["unknown_soft_memory"];
}

function contextTokens(context: NormalizedMusicContext) {
  return uniqueStrings([
    context.sceneType,
    context.activity,
    ...context.visibleObjects,
    ...context.timeFeeling,
    ...context.colorFeeling,
    ...context.emotionalTone,
    ...context.culturalSignals,
  ]).flatMap(tokenize);
}

function weightedOverlap(source: string[], target: string[]) {
  let score = 0;
  const targetTokens = target.flatMap(tokenize);

  for (const sourceToken of source.flatMap(tokenize)) {
    for (const targetToken of targetTokens) {
      if (sourceToken === targetToken) score += 3;
      else if (sourceToken.includes(targetToken) || targetToken.includes(sourceToken)) {
        score += 1;
      }
    }
  }

  return score;
}
