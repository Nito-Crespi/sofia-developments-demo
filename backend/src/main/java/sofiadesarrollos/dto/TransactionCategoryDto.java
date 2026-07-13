package sofiadesarrollos.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionCategoryDto {

    private String id;

    private String name;
}
