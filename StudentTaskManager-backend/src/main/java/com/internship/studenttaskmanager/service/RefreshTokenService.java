package com.internship.studenttaskmanager.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.internship.studenttaskmanager.model.RefreshToken;
import com.internship.studenttaskmanager.model.User;
import com.internship.studenttaskmanager.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final long refreshExpirationMs;

    public RefreshTokenService(RefreshTokenRepository repo,
            @Value("${jwt.refresh-expiration-ms:604800000}") long refreshExpirationMs) {
        this.repo = repo;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // delete existing tokens for user
        repo.deleteByUser(user);

        RefreshToken rt = new RefreshToken();
        rt.setUser(user);
        rt.setToken(UUID.randomUUID().toString());
        rt.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));
        return repo.save(rt);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return repo.findByToken(token);
    }

    @Transactional
    public void removeToken(RefreshToken token) {
        if (token != null && token.getId() != null) {
            repo.delete(token);
        }
    }

    @Transactional
    public void removeByUser(User user) {
        repo.deleteByUser(user);
    }
}
