package com.tatya.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmLocation {
    private String id;
    private double lat;
    private double lon;
}
