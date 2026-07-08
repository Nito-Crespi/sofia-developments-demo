package sofiadesarrollos.dto;

import java.util.HashSet;
import java.util.stream.Collectors;
import sofiadesarrollos.data.ProjectEntity;
import sofiadesarrollos.data.projectdetails.ProjectPermit;

public final class ProjectMapper {

    private ProjectMapper() {
    }

    public static ProjectDto toDto(ProjectEntity entity) {
        if (entity == null) {
            return null;
        }
        return ProjectDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .location(entity.getLocation())
                .client(entity.getClient())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .startDate(entity.getStartDate())
                .estimatedEndDate(entity.getEstimatedEndDate())
                .actualEndDate(entity.getActualEndDate())
                .budget(entity.getBudget())
                .currentCost(entity.getCurrentCost())
                .paymentsReceived(entity.getPaymentsReceived())
                .estimatedProfit(entity.getEstimatedProfit())
                .constructionType(entity.getConstructionType())
                .area(entity.getArea())
                .floors(entity.getFloors())
                .technicalSpecs(entity.getTechnicalSpecs())
                .mainMaterials(entity.getMainMaterials() != null
                        ? entity.getMainMaterials().stream().collect(Collectors.toList())
                        : null)
                .projectManager(entity.getProjectManager())
                .assignedTeam(entity.getAssignedTeam() != null
                        ? entity.getAssignedTeam().stream().collect(Collectors.toList())
                        : null)
                .permits(entity.getPermits() != null
                        ? entity.getPermits().stream()
                        .map(permit -> ProjectDto.ProjectPermitDto.builder()
                                .name(permit.getName())
                                .status(permit.getStatus())
                                .expiryDate(permit.getExpiryDate())
                                .build())
                        .collect(Collectors.toList())
                        : null)
                .notes(entity.getNotes())
                .documents(entity.getDocuments() != null
                        ? entity.getDocuments().stream().collect(Collectors.toList())
                        : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .build();
    }

    public static ProjectEntity toEntity(ProjectDto dto) {
        if (dto == null) {
            return null;
        }
        return ProjectEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .client(dto.getClient())
                .status(dto.getStatus())
                .priority(dto.getPriority())
                .startDate(dto.getStartDate())
                .estimatedEndDate(dto.getEstimatedEndDate())
                .actualEndDate(dto.getActualEndDate())
                .budget(dto.getBudget())
                .currentCost(dto.getCurrentCost())
                .paymentsReceived(dto.getPaymentsReceived())
                .estimatedProfit(dto.getEstimatedProfit())
                .constructionType(dto.getConstructionType())
                .area(dto.getArea())
                .floors(dto.getFloors())
                .technicalSpecs(dto.getTechnicalSpecs())
                .mainMaterials(dto.getMainMaterials() != null
                        ? new HashSet<>(dto.getMainMaterials())
                        : new HashSet<>())
                .projectManager(dto.getProjectManager())
                .assignedTeam(dto.getAssignedTeam() != null
                        ? new HashSet<>(dto.getAssignedTeam())
                        : new HashSet<>())
                .permits(dto.getPermits() != null
                        ? dto.getPermits().stream()
                        .map(permit -> ProjectPermit.builder()
                                .name(permit.getName())
                                .status(permit.getStatus())
                                .expiryDate(permit.getExpiryDate())
                                .build())
                        .collect(Collectors.toSet())
                        : new HashSet<>())
                .notes(dto.getNotes())
                .documents(dto.getDocuments() != null
                        ? new HashSet<>(dto.getDocuments())
                        : new HashSet<>())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .createdBy(dto.getCreatedBy())
                .build();
    }
}

