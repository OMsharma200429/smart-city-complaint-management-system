package com.chinmay.complaintsystem.service;

import org.springframework.stereotype.Service;

import com.chinmay.complaintsystem.model.User;
import com.chinmay.complaintsystem.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User register(User user) {
        // check if email already exists
        if (repo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        user.setRole("USER");
        return repo.save(user);
    }

    public User login(String email, String password) {
        User user = repo.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

}