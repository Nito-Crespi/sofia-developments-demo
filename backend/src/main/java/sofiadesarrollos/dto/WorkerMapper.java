package sofiadesarrollos.dto;

import sofiadesarrollos.data.Worker;

public class WorkerMapper {

    public static WorkerDto toDto(Worker entity) {
        if (entity == null) {
            return null;
        }
        return new WorkerDto(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getDni(),
                entity.getPhone(),
                entity.getHourlyRate(),
                entity.getActive()
        );
    }

    public static Worker toEntity(WorkerDto dto) {
        if (dto == null) {
            return null;
        }
        Worker entity = new Worker();
        entity.setId(dto.getId());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setDni(dto.getDni());
        entity.setPhone(dto.getPhone());
        entity.setHourlyRate(dto.getHourlyRate());
        entity.setActive(dto.getActive());
        return entity;
    }
}
