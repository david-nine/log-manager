package com.spynet.logmanager.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "registration", nullable = false)
    private String registration;

    @NotNull
    @Column(name = "hostname", nullable = false)
    private String hostname;

    @Column(name = "workload_minutes")
    private Long workloadMinutes;

    @ManyToOne
    private Manager manager;

    @NotNull
    @ManyToOne
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Employee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Employee name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegistration() {
        return this.registration;
    }

    public Employee registration(String registration) {
        this.setRegistration(registration);
        return this;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public String getHostname() {
        return this.hostname;
    }

    public Employee hostname(String hostname) {
        this.setHostname(hostname);
        return this;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public Long getWorkloadMinutes() {
        return this.workloadMinutes;
    }

    public Employee workloadMinutes(Long workloadMinutes) {
        this.setWorkloadMinutes(workloadMinutes);
        return this;
    }

    public void setWorkloadMinutes(Long workloadMinutes) {
        this.workloadMinutes = workloadMinutes;
    }

    public Manager getManager() {
        return this.manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }

    public Employee manager(Manager manager) {
        this.setManager(manager);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Employee company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", registration='" + getRegistration() + "'" +
            ", hostname='" + getHostname() + "'" +
            ", workloadMinutes=" + getWorkloadMinutes() +
            "}";
    }
}
