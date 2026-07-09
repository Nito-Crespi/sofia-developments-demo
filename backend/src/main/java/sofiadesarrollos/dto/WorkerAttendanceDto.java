package sofiadesarrollos.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerAttendanceDto {

    private String workerId;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private Boolean mealConsumed;

}