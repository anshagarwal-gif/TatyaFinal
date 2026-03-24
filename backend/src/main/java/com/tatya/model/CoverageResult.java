package com.tatya.model;

import lombok.Data;
import java.util.List;

@Data
public class CoverageResult {
    private List<String> keptCenters;
    private List<String> coveredFarms;
    private int keptCount;
    private int coveredCount;

    public CoverageResult(List<String> keptCenters, List<String> coveredFarms) {
        this.keptCenters = keptCenters;
        this.coveredFarms = coveredFarms;
        this.keptCount = keptCenters != null ? keptCenters.size() : 0;
        this.coveredCount = coveredFarms != null ? coveredFarms.size() : 0;
    }
}
