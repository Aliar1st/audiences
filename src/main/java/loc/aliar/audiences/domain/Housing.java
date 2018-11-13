package loc.aliar.audiences.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Document
public class Housing {

    @Id
    private String id;
    private int number;

    @EqualsAndHashCode.Exclude
    @DBRef
    private List<Audience> audiences = new ArrayList<>();

    public Housing(int number) {
        this.number = number;
    }
}
