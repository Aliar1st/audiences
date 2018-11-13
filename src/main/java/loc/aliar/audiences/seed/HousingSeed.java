package loc.aliar.audiences.seed;

import loc.aliar.audiences.domain.Audience;
import loc.aliar.audiences.domain.Housing;
import loc.aliar.audiences.repository.AudienceRepository;
import loc.aliar.audiences.repository.HousingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class HousingSeed implements CommandLineRunner {

    private final HousingRepository housingRepository;
    private final AudienceRepository audienceRepository;

    @Autowired
    public HousingSeed(HousingRepository housingRepository, AudienceRepository audienceRepository) {
        this.housingRepository = housingRepository;
        this.audienceRepository = audienceRepository;
    }

    @Override
    public void run(String... args) {


        Audience a1 = new Audience("1", 33, "lecture", 1);
        Audience a2 = new Audience("2a", 23, "computer", 2);
//        Audience a3 = new Audience(3, 23, "lecture", 3);
//        Audience a4 = new Audience(5, 35, "computer", 1);
//        Audience a5 = new Audience(6, 25, "lecture", 2);
//        Audience a6 = new Audience(7, 25, "computer", 2);
//        Audience a7 = new Audience(8, 39, "lecture", 1);
//        Audience a8 = new Audience(9, 29, "computer", 1);
//        Audience a9 = new Audience(10, 29, "lecture", 1);

        audienceRepository.saveAll(Arrays.asList(a1, a2));

        Housing housing1 = new Housing(1);
        housing1.setAudiences(Arrays.asList(a1, a2));

        Housing housing2 = new Housing(2);
//        housing2.setAudiences(Arrays.asList(a4, a5, a6));
//
//        Housing housing3 = new Housing(3);
//        housing3.setAudiences(Arrays.asList(a7, a8, a9));

        housingRepository.saveAll(Arrays.asList(housing1, housing2));
    }
}
