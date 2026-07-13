package sofiadesarrollos.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryDto {

    private BigDecimal income;

    private BigDecimal expenses;

    private BigDecimal balance;
}
