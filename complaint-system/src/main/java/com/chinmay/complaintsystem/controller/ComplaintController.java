package com.chinmay.complaintsystem.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chinmay.complaintsystem.model.Complaint;
import com.chinmay.complaintsystem.repository.ComplaintRepository;
import com.chinmay.complaintsystem.service.DashboardService;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository repository;

    @Autowired
    private DashboardService dashboardService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@RequestBody Complaint complaint) {

        if (complaint.getPriority() == null || complaint.getPriority().isEmpty()) {
            complaint.setPriority("medium");
        }

        complaint.setStatus("Submitted");
        complaint.setCreatedAt(java.time.LocalDateTime.now());

        Complaint saved = repository.save(complaint);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<?> getComplaint(@PathVariable String complaintId) {

        Optional<Complaint> complaint = repository.findByComplaintId(complaintId);

        if (complaint.isPresent()) {
            return ResponseEntity.ok(complaint.get());
        } else {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Complaint not found"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> findByEmail(@RequestParam String email) {

        List<Complaint> list = repository.findByEmail(email);

        if (list.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(List.of());
        }

        return ResponseEntity.ok(list);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {

        Optional<Complaint> optional = repository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Complaint not found"));
        }

        Complaint complaint = optional.get();
        complaint.setStatus(status);

        if ("Resolved".equalsIgnoreCase(status)) {
            complaint.setResolvedAt(java.time.LocalDateTime.now());
        }

        return ResponseEntity.ok(repository.save(complaint));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComplaint(
            @PathVariable Long id,
            @RequestBody Complaint updatedComplaint) {

        Optional<Complaint> optional = repository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Complaint not found"));
        }

        Complaint complaint = optional.get();

        if (updatedComplaint.getStatus() != null) {
            complaint.setStatus(updatedComplaint.getStatus());

            if ("Resolved".equalsIgnoreCase(updatedComplaint.getStatus())) {
                complaint.setResolvedAt(java.time.LocalDateTime.now());
            }
        }

        if (updatedComplaint.getRemark() != null) {
            complaint.setRemark(updatedComplaint.getRemark());
        }

        if (updatedComplaint.getDescription() != null) {
            complaint.setDescription(updatedComplaint.getDescription());
        }

        if (updatedComplaint.getPriority() != null) {
            complaint.setPriority(updatedComplaint.getPriority());
        }

        return ResponseEntity.ok(repository.save(complaint));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}