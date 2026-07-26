package com.chinmay.complaintsystem.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String complaintId;

    private String subject;
    
    @Column(length = 5000)
    private String description;

    private String remark;
    private String category;
    private String priority;
    private String status;
    private String citizen;

    private String email;
    private String phone; 
    private String location;
    private String ward;    

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}