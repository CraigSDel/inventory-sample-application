package web.app.craigstroberg.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import web.app.craigstroberg.web.rest.TestUtil;

class FarmTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Farm.class);
        Farm farm1 = new Farm();
        farm1.setId("id1");
        Farm farm2 = new Farm();
        farm2.setId(farm1.getId());
        assertThat(farm1).isEqualTo(farm2);
        farm2.setId("id2");
        assertThat(farm1).isNotEqualTo(farm2);
        farm1.setId(null);
        assertThat(farm1).isNotEqualTo(farm2);
    }
}
