package sofiadesarrollos.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectsFinanceSummaryDto {

    private String projectId;

    private String projectName;

    private BigDecimal income;

    private BigDecimal expenses;

    private BigDecimal balance;
}