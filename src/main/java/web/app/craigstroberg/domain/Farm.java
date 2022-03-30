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
 * A Farm.
 */
@Entity
@Table(name = "farm")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Farm implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "date_added")
    private Instant dateAdded;

    @Column(name = "last_modified")
    private Instant lastModified;

    @OneToMany(mappedBy = "farm")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semen", "farm", "breed" }, allowSetters = true)
    private Set<SemenDonor> semenDonors = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "farms", "country" }, allowSetters = true)
    private Location location;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Farm id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Farm name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Farm description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateAdded() {
        return this.dateAdded;
    }

    public Farm dateAdded(Instant dateAdded) {
        this.setDateAdded(dateAdded);
        return this;
    }

    public void setDateAdded(Instant dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Instant getLastModified() {
        return this.lastModified;
    }

    public Farm lastModified(Instant lastModified) {
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
            this.semenDonors.forEach(i -> i.setFarm(null));
        }
        if (semenDonors != null) {
            semenDonors.forEach(i -> i.setFarm(this));
        }
        this.semenDonors = semenDonors;
    }

    public Farm semenDonors(Set<SemenDonor> semenDonors) {
        this.setSemenDonors(semenDonors);
        return this;
    }

    public Farm addSemenDonor(SemenDonor semenDonor) {
        this.semenDonors.add(semenDonor);
        semenDonor.setFarm(this);
        return this;
    }

    public Farm removeSemenDonor(SemenDonor semenDonor) {
        this.semenDonors.remove(semenDonor);
        semenDonor.setFarm(null);
        return this;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Farm location(Location location) {
        this.setLocation(location);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Farm)) {
            return false;
        }
        return id != null && id.equals(((Farm) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Farm{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            ", lastModified='" + getLastModified() + "'" +
            "}";
    }
}
