package sofiadesarrollos.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategorySummaryDto {

    private String category;

    private BigDecimal amount;
}
