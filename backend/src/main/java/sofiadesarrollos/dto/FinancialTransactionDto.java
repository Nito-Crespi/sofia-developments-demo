package sofiadesarrollos.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sofiadesarrollos.data.TransactionCategory;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialTransactionDto {

    private String id;

    private LocalDate date;

    private BigDecimal amount;

    private String type;

    private TransactionCategory category;

    private String projectId;

    private String description;
}