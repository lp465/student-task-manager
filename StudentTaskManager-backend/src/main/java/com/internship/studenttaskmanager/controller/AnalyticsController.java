package com.internship.studenttaskmanager.controller;

import com.internship.studenttaskmanager.dto.AnalyticsSummaryDTO;
import com.internship.studenttaskmanager.dto.ApiResponse;
import com.internship.studenttaskmanager.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ApiResponse<AnalyticsSummaryDTO> summary(org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        AnalyticsSummaryDTO dto = analyticsService.summaryForUser(email);
        return ApiResponse.success("Analytics retrieved", dto);
    }
}
