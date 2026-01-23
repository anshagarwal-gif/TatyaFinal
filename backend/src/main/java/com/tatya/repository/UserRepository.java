package com.tatya.repository;

import com.tatya.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByPhone(String phone);
    
    Optional<User> findByEmail(String email);
    
    // Case-insensitive email lookup
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);
    
    boolean existsByPhone(String phone);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);
    
    // Count users by role
    long countByRole(User.UserRole role);
    
    // Count all users excluding admins
    @Query("SELECT COUNT(u) FROM User u WHERE u.role != 'ADMIN'")
    long countAllNonAdminUsers();
}






