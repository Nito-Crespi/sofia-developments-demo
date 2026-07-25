package sofiadesarrollos.data;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sofiadesarrollos.data.projectdetails.ConstructionType;
import sofiadesarrollos.data.projectdetails.ProjectPermit;
import sofiadesarrollos.data.projectdetails.ProjectPriority;
import sofiadesarrollos.data.projectdetails.ProjectStatus;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // General
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String client;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectPriority priority;

    // Dates
    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate estimatedEndDate;

    private LocalDate actualEndDate;

    // Financial
    @Column(nullable = false)
    private BigDecimal budget;

    @Column(nullable = false)
    private BigDecimal currentCost;

    @Column(nullable = false)
    private BigDecimal paymentsReceived;

    @Column(nullable = false)
    private BigDecimal estimatedProfit;

    // Technical
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConstructionType constructionType;

    @Column(nullable = false)
    private Double area;

    private Integer floors;

    @Column(length = 2000)
    private String technicalSpecs;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_materials", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "material")
    @Builder.Default
    private Set<String> mainMaterials = new HashSet<>();

    @Column(nullable = false)
    private String projectManager;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_team", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "team_member")
    @Builder.Default
    private Set<String> assignedTeam = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_permits", joinColumns = @JoinColumn(name = "project_id"))
    @Builder.Default
    private Set<ProjectPermit> permits = new HashSet<>();

    @Column(length = 3000)
    private String notes;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_documents", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "document")
    @Builder.Default
    private Set<String> documents = new HashSet<>();

    // Metadata
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private String createdBy;


}
