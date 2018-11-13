package loc.aliar.audiences.domain.projection;

import loc.aliar.audiences.domain.Housing;
import org.springframework.data.rest.core.config.Projection;

import java.util.List;

@Projection(
        name = "housingWithAudiences",
        types = {Housing.class}
)
public interface HousingWithAudiences {
    String getId();
    int getNumber();
    List<Audience> getAudiences();
}
