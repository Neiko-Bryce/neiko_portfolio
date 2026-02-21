<?php

// Registration is disabled for this portfolio application.
// These tests verify that registration routes are not accessible.

test('registration screen is not accessible', function () {
    $response = $this->get('/register');

    $response->assertStatus(404);
});