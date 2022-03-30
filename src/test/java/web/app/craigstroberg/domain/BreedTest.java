package web.app.craigstroberg.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import web.app.craigstroberg.web.rest.TestUtil;

class BreedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Breed.class);
        Breed breed1 = new Breed();
        breed1.setId("id1");
        Breed breed2 = new Breed();
        breed2.setId(breed1.getId());
        assertThat(breed1).isEqualTo(breed2);
        breed2.setId("id2");
        assertThat(breed1).isNotEqualTo(breed2);
        breed1.setId(null);
        assertThat(breed1).isNotEqualTo(breed2);
    }
}
