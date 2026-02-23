<?php

// Password reset is disabled for this portfolio application.
// These tests verify that password reset routes are not accessible.

test('reset password link screen is not accessible', function () {
    $response = $this->get('/forgot-password');

    $response->assertStatus(404);
});

test('password reset link cannot be requested', function () {
    $response = $this->post('/forgot-password', ['email' => 'test@example.com']);

    $response->assertStatus(404);
});

test('reset password screen is not accessible', function () {
    $response = $this->get('/reset-password/token');

    $response->assertStatus(404);
});
