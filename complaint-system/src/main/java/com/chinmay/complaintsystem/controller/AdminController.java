package com.chinmay.complaintsystem.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.chinmay.complaintsystem.model.Admin;
import com.chinmay.complaintsystem.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/login")
    public Admin login(@RequestBody Map<String, String> body) {
        return service.login(body.get("email"), body.get("password"));
    }
}