package com.chinmay.complaintsystem.service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chinmay.complaintsystem.model.Complaint;
import com.chinmay.complaintsystem.repository.ComplaintRepository;

@Service
public class DashboardService {

    @Autowired
    private ComplaintRepository repository;

    public Map<String, Object> getDashboardData() {

        List<Complaint> complaints = repository.findAll();

        // 🔹 Response Stats
        long within24 = 0, within3d = 0, within7d = 0, pending = 0;

        for (Complaint c : complaints) {
            if ("Resolved".equals(c.getStatus()) && c.getResolvedAt() != null) {

                long hours = Duration.between(c.getCreatedAt(), c.getResolvedAt()).toHours();

                if (hours <= 24) within24++;
                if (hours <= 72) within3d++;
                if (hours <= 168) within7d++;

            } else {
                pending++;
            }
        }

        long total = complaints.size() == 0 ? 1 : complaints.size();

        Map<String, Integer> responseStats = new HashMap<>();
        responseStats.put("within24", (int) ((within24 * 100) / total));
        responseStats.put("within3d", (int) ((within3d * 100) / total));
        responseStats.put("within7d", (int) ((within7d * 100) / total));
        responseStats.put("pending", (int) ((pending * 100) / total));

        // 🔹 Stats
        int totalComplaints = complaints.size();
        int resolved = (int) complaints.stream()
                .filter(c -> "Resolved".equals(c.getStatus()))
                .count();

        int inProgress = (int) complaints.stream()
                .filter(c -> "In Progress".equals(c.getStatus()))
                .count();

        int submitted = (int) complaints.stream()
                .filter(c -> "Submitted".equals(c.getStatus()))
                .count();

        List<Map<String, Object>> stats = java.util.Arrays.asList(

                new HashMap<String, Object>() {{
                    put("label", "Total Complaints");
                    put("value", totalComplaints);
                    put("icon", "FileText");
                    put("color", "text-accent");
                }},

                new HashMap<String, Object>() {{
                    put("label", "Resolved");
                    put("value", resolved);
                    put("icon", "CheckCircle2");
                    put("color", "text-status-green");
                }},

                new HashMap<String, Object>() {{
                    put("label", "In Progress");
                    put("value", inProgress);
                    put("icon", "Loader2");
                    put("color", "text-accent");
                }},

                new HashMap<String, Object>() {{
                    put("label", "Submitted");
                    put("value", submitted);
                    put("icon", "AlertTriangle");
                    put("color", "text-status-yellow");
                }}

        );

        // 🔹 Category Data
        Map<String, Map<String, Object>> categoryMap = new HashMap<>();

        for (Complaint c : complaints) {

            String cat = c.getCategory() != null ? c.getCategory() : "Other";

            if (!categoryMap.containsKey(cat)) {
                Map<String, Object> catData = new HashMap<>();
                catData.put("category", cat);
                catData.put("count", 0);
                catData.put("resolved", 0);
                catData.put("icon", "FileText");
                catData.put("color", "text-accent");
                categoryMap.put(cat, catData);
            }

            Map<String, Object> catData = categoryMap.get(cat);

            catData.put("count", (int) catData.get("count") + 1);

            if ("Resolved".equals(c.getStatus())) {
                catData.put("resolved", (int) catData.get("resolved") + 1);
            }
        }

        List<Map<String, Object>> categoryData = categoryMap.values()
                .stream()
                .collect(Collectors.toList());

        // 🔹 Recent Complaints (last 5)
        List<Map<String, Object>> recentComplaints = complaints.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", c.getComplaintId());
                    m.put("subject", c.getSubject());
                    m.put("category", c.getCategory());
                    m.put("status", c.getStatus());
                    m.put("priority", c.getPriority());
                    m.put("date", c.getCreatedAt().toLocalDate().toString());
                    return m;
                })
                .collect(Collectors.toList());

        // 🔹 Final JSON
        Map<String, Object> result = new HashMap<>();
        result.put("responseStats", responseStats);
        result.put("stats", stats);
        result.put("categoryData", categoryData);
        result.put("recentComplaints", recentComplaints);

        return result;
    }
}