package sofiadesarrollos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDto {

    private String id;
    private String firstName;
    private String lastName;
    private String dni;
    private String phone;
    private Double hourlyRate;
    private Boolean active;

}
