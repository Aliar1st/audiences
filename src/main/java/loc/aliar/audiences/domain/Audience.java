package loc.aliar.audiences.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Data
@Document
public class Audience {

    @Id
    private String id;
    private String number;
    private int roominess;
    private String type;
    private int floor;

    public Audience(String number, int roominess, String type, int floor) {
        this.number = number;
        this.roominess = roominess;
        this.type = type;
        this.floor = floor;
    }
}
