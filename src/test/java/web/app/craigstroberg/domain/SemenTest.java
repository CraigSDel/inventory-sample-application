package web.app.craigstroberg.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import web.app.craigstroberg.web.rest.TestUtil;

class SemenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Semen.class);
        Semen semen1 = new Semen();
        semen1.setId("id1");
        Semen semen2 = new Semen();
        semen2.setId(semen1.getId());
        assertThat(semen1).isEqualTo(semen2);
        semen2.setId("id2");
        assertThat(semen1).isNotEqualTo(semen2);
        semen1.setId(null);
        assertThat(semen1).isNotEqualTo(semen2);
    }
}
