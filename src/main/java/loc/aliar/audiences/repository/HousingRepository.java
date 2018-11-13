package loc.aliar.audiences.repository;

import loc.aliar.audiences.domain.Housing;
import loc.aliar.audiences.domain.projection.HousingWithAudiences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(excerptProjection = HousingWithAudiences.class)
public interface HousingRepository extends MongoRepository<Housing, String> {
}
