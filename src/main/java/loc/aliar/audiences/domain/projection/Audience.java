package loc.aliar.audiences.domain.projection;

import org.springframework.data.rest.core.config.Projection;

@Projection(
        name = "housingWithAudiences",
        types = {Audience.class}
)
public interface Audience {
    String getId();
    String getNumber();
    int getRoominess();
    String getType();
    int getFloor();
}
