package com.nishant.backend.controller;

import com.nishant.backend.model.Tag;
import com.nishant.backend.repository.TagRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagRepository tagRepository;

    public TagController(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @GetMapping
    public List<Tag> getAll() {
        return tagRepository.findAll();
    }

    @PostMapping
    public Tag create(@RequestBody Tag tag) {
        return tagRepository.save(tag);
    }
}
