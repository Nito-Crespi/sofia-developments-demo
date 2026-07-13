package sofiadesarrollos.dto;

import sofiadesarrollos.data.FinancialTransaction;
import sofiadesarrollos.data.TransactionType;

public class FinancialTransactionMapper {

    public FinancialTransactionDto toDto(FinancialTransaction entity) {

        if (entity == null) {
            return null;
        }

        return FinancialTransactionDto.builder()
                .id(entity.getId())
                .date(entity.getTransactionDate())
                .amount(entity.getAmount())
                .type(entity.getType().name())
                .category(entity.getCategory() != null ? entity.getCategory() : null)
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .description(entity.getDescription())
                .build();
    }

    public FinancialTransaction toEntity(FinancialTransactionDto dto) {

        if (dto == null) {
            return null;
        }

        FinancialTransaction entity = new FinancialTransaction();

        entity.setId(dto.getId());
        entity.setTransactionDate(dto.getDate());
        entity.setAmount(dto.getAmount());
        entity.setType(TransactionType.valueOf(dto.getType()));
        entity.setCategory(dto.getCategory());
        entity.setDescription(dto.getDescription());

        return entity;
    }
}
