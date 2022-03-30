package web.app.craigstroberg.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import web.app.craigstroberg.domain.enumeration.SemenStatus;

/**
 * A Semen.
 */
@Entity
@Table(name = "semen")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Semen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "received_date")
    private Instant receivedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SemenStatus status;

    @Column(name = "last_modified")
    private Instant lastModified;

    @ManyToOne
    @JsonIgnoreProperties(value = { "semen", "farm", "breed" }, allowSetters = true)
    private SemenDonor semenDonor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Semen id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getReceivedDate() {
        return this.receivedDate;
    }

    public Semen receivedDate(Instant receivedDate) {
        this.setReceivedDate(receivedDate);
        return this;
    }

    public void setReceivedDate(Instant receivedDate) {
        this.receivedDate = receivedDate;
    }

    public SemenStatus getStatus() {
        return this.status;
    }

    public Semen status(SemenStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(SemenStatus status) {
        this.status = status;
    }

    public Instant getLastModified() {
        return this.lastModified;
    }

    public Semen lastModified(Instant lastModified) {
        this.setLastModified(lastModified);
        return this;
    }

    public void setLastModified(Instant lastModified) {
        this.lastModified = lastModified;
    }

    public SemenDonor getSemenDonor() {
        return this.semenDonor;
    }

    public void setSemenDonor(SemenDonor semenDonor) {
        this.semenDonor = semenDonor;
    }

    public Semen semenDonor(SemenDonor semenDonor) {
        this.setSemenDonor(semenDonor);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Semen)) {
            return false;
        }
        return id != null && id.equals(((Semen) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Semen{" +
            "id=" + getId() +
            ", receivedDate='" + getReceivedDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", lastModified='" + getLastModified() + "'" +
            "}";
    }
}
