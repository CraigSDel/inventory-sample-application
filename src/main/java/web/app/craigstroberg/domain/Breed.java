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
 * A Breed.
 */
@Entity
@Table(name = "breed")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Breed implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "description")
    private String description;

    @Column(name = "date_added")
    private Instant dateAdded;

    @Column(name = "last_modified")
    private Instant lastModified;

    @OneToMany(mappedBy = "breed")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semen", "farm", "breed" }, allowSetters = true)
    private Set<SemenDonor> semenDonors = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Breed id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Breed description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateAdded() {
        return this.dateAdded;
    }

    public Breed dateAdded(Instant dateAdded) {
        this.setDateAdded(dateAdded);
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Instant getLastModified() {
        return this.lastModified;
    }

    public Breed lastModified(Instant lastModified) {
        this.setLastModified(lastModified);
        return this;
    }

    public void setLastModified(Instant lastModified) {
        this.lastModified = lastModified;
    }

    public Set<SemenDonor> getSemenDonors() {
        return this.semenDonors;
    }

    public void setSemenDonors(Set<SemenDonor> semenDonors) {
        if (this.semenDonors != null) {
            this.semenDonors.forEach(i -> i.setBreed(null));
        }
        if (semenDonors != null) {
            semenDonors.forEach(i -> i.setBreed(this));
        }
        this.semenDonors = semenDonors;
    }

    public Breed semenDonors(Set<SemenDonor> semenDonors) {
        this.setSemenDonors(semenDonors);
        return this;
    }

    public Breed addSemenDonor(SemenDonor semenDonor) {
        this.semenDonors.add(semenDonor);
        semenDonor.setBreed(this);
        return this;
    }

    public Breed removeSemenDonor(SemenDonor semenDonor) {
        this.semenDonors.remove(semenDonor);
        semenDonor.setBreed(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Breed)) {
            return false;
        }
        return id != null && id.equals(((Breed) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Breed{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            ", lastModified='" + getLastModified() + "'" +
            "}";
    }
}
