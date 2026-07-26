package com.chinmay.complaintsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chinmay.complaintsystem.model.Admin;
import com.chinmay.complaintsystem.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository repo;

    public Admin login(String email, String password) {

        Admin admin = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return admin;
    }
}