package loc.aliar.audiences.repository;

import loc.aliar.audiences.domain.Audience;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AudienceRepository extends MongoRepository<Audience, String> {
}
