package com.taptaza.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public class ServiceResponse {

    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;

    public ServiceResponse() {
    }

    public ServiceResponse(UUID id, String name, String description, BigDecimal price, Integer durationMinutes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.durationMinutes = durationMinutes;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
