package web.app.craigstroberg.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SemenDonor.
 */
@Entity
@Table(name = "semen_donor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SemenDonor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "producing")
    private Boolean producing;

    @Column(name = "last_modified")
    private Instant lastModified;

    @OneToMany(mappedBy = "semenDonor")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semenDonor" }, allowSetters = true)
    private Set<Semen> semen = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "semenDonors", "location" }, allowSetters = true)
    private Farm farm;

    @ManyToOne
    @JsonIgnoreProperties(value = { "semenDonors" }, allowSetters = true)
    private Breed breed;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public SemenDonor id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getProducing() {
        return this.producing;
    }

    public SemenDonor producing(Boolean producing) {
        this.setProducing(producing);
        return this;
    }

    public void setProducing(Boolean producing) {
        this.producing = producing;
    }

    public Instant getLastModified() {
        return this.lastModified;
    }

    public SemenDonor lastModified(Instant lastModified) {
        this.setLastModified(lastModified);
        return this;
    }

    public void setLastModified(Instant lastModified) {
        this.lastModified = lastModified;
    }

    public Set<Semen> getSemen() {
        return this.semen;
    }

    public void setSemen(Set<Semen> semen) {
        if (this.semen != null) {
            this.semen.forEach(i -> i.setSemenDonor(null));
        }
        if (semen != null) {
            semen.forEach(i -> i.setSemenDonor(this));
        }
        this.semen = semen;
    }

    public SemenDonor semen(Set<Semen> semen) {
        this.setSemen(semen);
        return this;
    }

    public SemenDonor addSemen(Semen semen) {
        this.semen.add(semen);
        semen.setSemenDonor(this);
        return this;
    }

    public SemenDonor removeSemen(Semen semen) {
        this.semen.remove(semen);
        semen.setSemenDonor(null);
        return this;
    }

    public Farm getFarm() {
        return this.farm;
    }

    public void setFarm(Farm farm) {
        this.farm = farm;
    }

    public SemenDonor farm(Farm farm) {
        this.setFarm(farm);
        return this;
    }

    public Breed getBreed() {
        return this.breed;
    }

    public void setBreed(Breed breed) {
        this.breed = breed;
    }

    public SemenDonor breed(Breed breed) {
        this.setBreed(breed);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SemenDonor)) {
            return false;
        }
        return id != null && id.equals(((SemenDonor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SemenDonor{" +
            "id=" + getId() +
            ", producing='" + getProducing() + "'" +
            ", lastModified='" + getLastModified() + "'" +
            "}";
    }
}
