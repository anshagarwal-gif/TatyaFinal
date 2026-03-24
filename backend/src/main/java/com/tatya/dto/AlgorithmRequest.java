package com.tatya.dto;

import lombok.Data;

@Data
public class AlgorithmRequest {
    private double alpha = 1.0;
    private double beta = 2.0;
    private double threshold = 0.0;
    private int minFarms = 1;
}
