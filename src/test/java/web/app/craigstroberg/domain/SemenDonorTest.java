package web.app.craigstroberg.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import web.app.craigstroberg.web.rest.TestUtil;

class SemenDonorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SemenDonor.class);
        SemenDonor semenDonor1 = new SemenDonor();
        semenDonor1.setId("id1");
        SemenDonor semenDonor2 = new SemenDonor();
        semenDonor2.setId(semenDonor1.getId());
        assertThat(semenDonor1).isEqualTo(semenDonor2);
        semenDonor2.setId("id2");
        assertThat(semenDonor1).isNotEqualTo(semenDonor2);
        semenDonor1.setId(null);
        assertThat(semenDonor1).isNotEqualTo(semenDonor2);
    }
}
