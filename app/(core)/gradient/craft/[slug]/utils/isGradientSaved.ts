import { GradientCollection } from "@/app/(core)/me/action";

export function isGradientSaved(
  gradients: GradientCollection[] | undefined,
  url: string
): boolean {
  if (gradients) {
    return gradients.findIndex((grad) => grad.name === url) !== -1;
  }
  return false;
}
