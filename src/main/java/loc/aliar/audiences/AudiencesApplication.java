package loc.aliar.audiences;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
public class AudiencesApplication {
    public static void main(String[] args) {
        SpringApplication.run(AudiencesApplication.class, args);
    }
}

