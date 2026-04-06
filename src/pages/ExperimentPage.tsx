import { Alert, Box, Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { getExperimentById, getRiveSrc } from "../config/projects";
import { PointCloudViewModelControls, RiveCanvas } from "../components/RiveCanvas";

export function ExperimentPage() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const project = experimentId ? getExperimentById(experimentId) : undefined;

  if (!project) {
    return (
      <Alert title="Not found" color="red" variant="light">
        No experiment matches this URL.
      </Alert>
    );
  }

  const src = getRiveSrc(project.rivPublicPath);

  return (
    <Stack gap="lg" h="100%">
      <Box>
        <Title order={2}>{project.title}</Title>
        {project.description ? (
          <Text c="dimmed" mt="xs" maw={640}>
            {project.description}
          </Text>
        ) : null}
      </Box>

      <Box
        w="100%"
        style={{
          borderRadius: "var(--mantine-radius-md)",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.25)",
        }}
        p="md"
      >
        <RiveCanvas
          src={src}
          artboard={project.artboard}
          stateMachine={project.stateMachine}
          viewModelName={project.viewModelName}
        >
          {project.id === "point-cloud" ? <PointCloudViewModelControls /> : null}
        </RiveCanvas>
      </Box>
    </Stack>
  );
}
