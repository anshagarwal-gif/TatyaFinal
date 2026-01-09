package com.tatya.controller;

import com.tatya.entity.Farm;
import com.tatya.entity.User;
import com.tatya.repository.FarmRepository;
import com.tatya.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "*")
public class FarmController {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addFarm(@RequestParam Long userId, @RequestBody Farm farm) {
        // In real app, userId comes from Principal/Context
        User owner = userRepository.findById(userId).orElse(null);
        if (owner == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        farm.setOwner(owner);
        Farm saved = farmRepository.save(farm);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Farm>> getUserFarms(@PathVariable Long userId) {
        return ResponseEntity.ok(farmRepository.findByOwnerId(userId));
    }

    @GetMapping
    public ResponseEntity<List<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmRepository.findAll());
    }
}
