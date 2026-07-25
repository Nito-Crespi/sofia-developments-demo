package sofiadesarrollos.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sofiadesarrollos.data.projectdetails.ConstructionType;
import sofiadesarrollos.data.projectdetails.PermitStatus;
import sofiadesarrollos.data.projectdetails.ProjectPriority;
import sofiadesarrollos.data.projectdetails.ProjectStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {

    private String id;

    // Información General
    @NotBlank(message = "Project name is required")
    private String name;

    @NotBlank(message = "Project code is required")
    private String code;

    @NotBlank(message = "Project description is required")
    private String description;

    @NotBlank(message = "Project location is required")
    private String location;

    @NotBlank(message = "Client name is required")
    private String client;

    @NotNull(message = "Project status is required")
    private ProjectStatus status;

    @NotNull(message = "Project priority is required")
    private ProjectPriority priority;

    // Fechas
    @NotNull(message = "Start date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotNull(message = "Estimated end date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate estimatedEndDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate actualEndDate;

    // Información Financiera
    @NotNull(message = "Budget is required")
    @PositiveOrZero(message = "Budget must be positive or zero")
    private BigDecimal budget;

    @NotNull(message = "Current cost is required")
    @PositiveOrZero(message = "Current cost must be positive or zero")
    private BigDecimal currentCost;

    @NotNull(message = "Payments received is required")
    @PositiveOrZero(message = "Payments received must be positive or zero")
    private BigDecimal paymentsReceived;

    @NotNull(message = "Estimated profit is required")
    private BigDecimal estimatedProfit;

    // Información Técnica
    @NotNull(message = "Construction type is required")
    private ConstructionType constructionType;

    @NotNull(message = "Area is required")
    @PositiveOrZero(message = "Area must be positive or zero")
    private Double area;

    private Integer floors;

    private String technicalSpecs;

    private List<String> mainMaterials;

    // Recursos Humanos
    @NotBlank(message = "Project manager is required")
    private String projectManager;

    private List<String> assignedTeam;

    // Permisos y Licencias
    @Valid
    private List<ProjectPermitDto> permits;

    // Notas y Documentos
    private String notes;

    private List<String> documents;

    // Metadatos
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    private String createdBy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectPermitDto {

        @NotBlank(message = "Permit name is required")
        private String name;

        @NotNull(message = "Permit status is required")
        private PermitStatus status;

        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate expiryDate;
    }
}
