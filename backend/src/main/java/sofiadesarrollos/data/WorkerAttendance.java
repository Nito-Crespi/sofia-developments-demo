package sofiadesarrollos.data;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sofiadesarrollos.dto.WorkerAttendanceDto;

/**
 * Association between Worker and Workday
*/
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private Worker worker;

    @ManyToOne
    private Workday workday;


    private LocalTime startTime;
    private LocalTime endTime;

    private Boolean mealConsumed;

    public static WorkerAttendance fulldayAttendance(Worker worker, Workday workday, WorkerAttendanceDto details) {
        return WorkerAttendance.builder()
                .worker(worker)
                .workday(workday)
                .startTime(workday.getStartTime())
                .endTime(workday.getEndTime())
                .mealConsumed(details.getMealConsumed()).build();
    }

    public Duration computeWorkedHours(){
        return Duration.between(startTime, endTime);
    }
}