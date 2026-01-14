package com.tatya.repository;

import com.tatya.entity.ClusterHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClusterHistoryRepository extends JpaRepository<ClusterHistory, Long> {
}
