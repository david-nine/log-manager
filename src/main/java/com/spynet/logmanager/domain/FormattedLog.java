package com.spynet.logmanager.domain;

import com.spynet.logmanager.domain.enumeration.StatusType;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FormattedLog.
 */
@Entity
@Table(name = "formatted_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FormattedLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "hostname", nullable = false, unique = true)
    private String hostname;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull
    @Column(name = "start_hour", nullable = false)
    private Instant startHour;

    @NotNull
    @Column(name = "end_hour", nullable = false)
    private Instant endHour;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    @NotNull
    @Column(name = "status", nullable = false)
    private StatusType status;

    public Long getId() {
        return this.id;
    }

    public FormattedLog id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHostname() {
        return this.hostname;
    }

    public FormattedLog hostname(String hostname) {
        this.setHostname(hostname);
        return this;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public FormattedLog startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public FormattedLog endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Instant getStartHour() {
        return this.startHour;
    }

    public FormattedLog startHour(Instant startHour) {
        this.setStartHour(startHour);
        return this;
    }

    public void setStartHour(Instant startHour) {
        this.startHour = startHour;
    }

    public Instant getEndHour() {
        return this.endHour;
    }

    public FormattedLog endHour(Instant endHour) {
        this.setEndHour(endHour);
        return this;
    }

    public void setEndHour(Instant endHour) {
        this.endHour = endHour;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    public StatusType getStatus() {
        return status;
    }

    public void setStatus(StatusType status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormattedLog)) {
            return false;
        }
        return id != null && id.equals(((FormattedLog) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormattedLog{" +
            "id=" + getId() +
            ", hostname='" + getHostname() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", startHour='" + getStartHour() + "'" +
            ", endHour='" + getEndHour() + "'" +
            "}";
    }
}
