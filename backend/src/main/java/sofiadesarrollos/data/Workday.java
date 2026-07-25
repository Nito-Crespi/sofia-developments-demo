package sofiadesarrollos.data;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workday {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Builder.Default
    private LocalTime startTime = LocalTime.of(9,0);

    @Builder.Default
    private LocalTime endTime = LocalTime.of(17,0);

    private LocalDate date;

    @Builder.Default
    private boolean rained=false;


}