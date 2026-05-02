package com.nishant.backend.controller;

import com.nishant.backend.model.Category;
import com.nishant.backend.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Category category) {
        // Input validation — defense against malicious input
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name cannot be empty");
        }
        if (category.getName().length() > 100) {
            return ResponseEntity.badRequest().body("Category name cannot exceed 100 characters");
        }
        if (category.getColor() != null && !category.getColor().matches("^#[0-9A-Fa-f]{6}$")) {
            return ResponseEntity.badRequest().body("Color must be a valid hex code (e.g. #FF5733)");
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Category updated) {
        if (updated.getName() == null || updated.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name cannot be empty");
        }
        if (updated.getName().length() > 100) {
            return ResponseEntity.badRequest().body("Category name cannot exceed 100 characters");
        }
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(updated.getName());
                    category.setColor(updated.getColor());
                    return ResponseEntity.ok((Object) categoryRepository.save(category));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
