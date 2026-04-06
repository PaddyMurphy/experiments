export type ExperimentProject = {
  id: string;
  title: string;
  description?: string;
  /** Path under `public/`, e.g. `animation/point_cloud.riv` */
  rivPublicPath: string;
  artboard: string;
  stateMachine: string;
  /** Rive Data / View Model name when the file uses VM bindings */
  viewModelName?: string;
};

/** Resolved URL for use with Rive `src` (fetch); works with Vite `base` including `./`. */
export function getRiveSrc(rivPublicPath: string): string {
  const base = import.meta.env.BASE_URL;
  const path = rivPublicPath.replace(/^\/+/, "");
  if (base.endsWith("/")) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}

export const experiments: ExperimentProject[] = [
  {
    id: "point-cloud",
    title: "Point Cloud",
    description: "Rive point field with responsive artboard and VM-driven parameters.",
    rivPublicPath: "animation/point_cloud.riv",
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    viewModelName: "PointCloudVM",
  },
];

export function getExperimentById(id: string): ExperimentProject | undefined {
  return experiments.find((e) => e.id === id);
}

export const defaultExperimentId = experiments[0]?.id ?? "point-cloud";
