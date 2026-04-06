import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceNumber,
  useViewModelInstanceString,
} from "@rive-app/react-canvas";
import type { ViewModelInstance } from "@rive-app/canvas";
import { Box, Group, Slider, Stack, Text, TextInput, type BoxProps } from "@mantine/core";
import { createContext, forwardRef, useContext, useEffect, useRef, type ReactNode } from "react";

export const RiveViewModelInstanceContext = createContext<ViewModelInstance | null>(null);

export function useRiveViewModelInstance(): ViewModelInstance | null {
  return useContext(RiveViewModelInstanceContext);
}

/** Default artboard pixel size (native); layout scales down with `max-width: 100%` + `aspect-ratio`. */
export const RIVE_DEFAULT_WIDTH = 600;
export const RIVE_DEFAULT_HEIGHT = 400;

/** Initial PointCloudVM values (overrides .riv defaults on load). */
export const POINT_CLOUD_DEFAULT_DENSITY = 1.5;
export const POINT_CLOUD_DEFAULT_POINT_SIZE = 2;
export const POINT_CLOUD_MAX_DENSITY = 15;

export type RiveCanvasProps = BoxProps & {
  src: string;
  artboard: string;
  stateMachine: string;
  viewModelName?: string;
  children?: ReactNode;
};

const RiveAspectBox = forwardRef<HTMLDivElement, { children: ReactNode }>(function RiveAspectBox(
  { children },
  ref,
) {
  return (
    <Box
      ref={ref}
      pos="relative"
      w="100%"
      maw={RIVE_DEFAULT_WIDTH}
      mx="auto"
      style={{
        aspectRatio: `${RIVE_DEFAULT_WIDTH} / ${RIVE_DEFAULT_HEIGHT}`,
      }}
    >
      {children}
    </Box>
  );
});

/**
 * Renders a Rive animation in a sized box. When `viewModelName` is set, loads that view model
 * and exposes the default instance via `RiveViewModelInstanceContext` for child controls.
 */
export function RiveCanvas({ viewModelName, ...rest }: RiveCanvasProps) {
  if (viewModelName) {
    return <RiveCanvasWithViewModel viewModelName={viewModelName} {...rest} />;
  }
  return <RiveCanvasPlain {...rest} />;
}

function RiveCanvasPlain({
  src,
  artboard,
  stateMachine,
  children,
  ...boxProps
}: Omit<RiveCanvasProps, "viewModelName">) {
  const { RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachine,
    autoplay: true,
  });

  return (
    <Box pos="relative" w="100%" {...boxProps}>
      <RiveViewModelInstanceContext.Provider value={null}>
        <Stack gap="md" w="100%">
          <RiveAspectBox>
            <RiveComponent style={{ width: "100%", height: "100%", display: "block" }} />
          </RiveAspectBox>
          {children}
        </Stack>
      </RiveViewModelInstanceContext.Provider>
    </Box>
  );
}

function RiveCanvasWithViewModel({
  src,
  artboard,
  stateMachine,
  viewModelName,
  children,
  ...boxProps
}: RiveCanvasProps & { viewModelName: string }) {
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines: stateMachine,
    autoplay: true,
  });

  const viewModel = useViewModel(rive, { name: viewModelName });
  const viewModelInstance = useViewModelInstance(viewModel, {
    useDefault: true,
    rive,
  });

  /** Size sync applies to the canvas region only (not sibling controls). */
  const canvasRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rive || !viewModelInstance) {
      return;
    }

    const el = canvasRegionRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return;
    }

    const apply = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      const nw = viewModelInstance.number("ArtboardWidth");
      const nh = viewModelInstance.number("ArtboardHeight");
      if (nw) {
        nw.value = w;
      }
      if (nh) {
        nh.value = h;
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [rive, viewModelInstance]);

  return (
    <Box pos="relative" w="100%" {...boxProps}>
      <RiveViewModelInstanceContext.Provider value={viewModelInstance}>
        <Stack gap="md" w="100%">
          <RiveAspectBox ref={canvasRegionRef}>
            <RiveComponent style={{ width: "100%", height: "100%", display: "block" }} />
          </RiveAspectBox>
          {children}
        </Stack>
      </RiveViewModelInstanceContext.Provider>
    </Box>
  );
}

/** Sliders and text for the PointCloudVM view model (Density, PointSize, Text). */
export function PointCloudViewModelControls() {
  const vm = useRiveViewModelInstance();
  const density = useViewModelInstanceNumber("Density", vm);
  const pointSize = useViewModelInstanceNumber("PointSize", vm);
  const text = useViewModelInstanceString("Text", vm);

  useEffect(() => {
    if (!vm) {
      return;
    }
    const d = vm.number("Density");
    const p = vm.number("PointSize");
    if (d) {
      d.value = POINT_CLOUD_DEFAULT_DENSITY;
    }
    if (p) {
      p.value = POINT_CLOUD_DEFAULT_POINT_SIZE;
    }
  }, [vm]);

  return (
    <Stack gap="md" mt="lg" maw={420}>
      <div>
        <Group justify="space-between" mb={6}>
          <Text size="sm" c="dimmed">
            Density
          </Text>
          <Text size="sm" ff="monospace">
            {density.value != null ? density.value.toFixed(1) : "—"}
          </Text>
        </Group>
        <Slider
          min={0}
          max={POINT_CLOUD_MAX_DENSITY}
          step={0.1}
          value={Math.min(density.value ?? POINT_CLOUD_DEFAULT_DENSITY, POINT_CLOUD_MAX_DENSITY)}
          onChange={(v) => density.setValue(Math.min(v, POINT_CLOUD_MAX_DENSITY))}
          disabled={density.value == null}
        />
      </div>
      <div>
        <Group justify="space-between" mb={6}>
          <Text size="sm" c="dimmed">
            Point size
          </Text>
          <Text size="sm" ff="monospace">
            {pointSize.value != null ? pointSize.value.toFixed(2) : "—"}
          </Text>
        </Group>
        <Slider
          min={0.5}
          max={8}
          step={0.05}
          value={pointSize.value ?? POINT_CLOUD_DEFAULT_POINT_SIZE}
          onChange={(v) => pointSize.setValue(v)}
          disabled={pointSize.value == null}
        />
      </div>
      <TextInput
        label="Text"
        description="String property on PointCloudVM"
        value={text.value ?? ""}
        onChange={(e) => text.setValue(e.currentTarget.value)}
        disabled={text.value == null}
      />
    </Stack>
  );
}
