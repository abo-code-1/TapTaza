package com.taptaza.controller;

import com.taptaza.dto.request.CreateAddressRequest;
import com.taptaza.dto.request.UpdateAddressRequest;
import com.taptaza.dto.request.UpdateUserRequest;
import com.taptaza.dto.response.AddressResponse;
import com.taptaza.dto.response.UserResponse;
import com.taptaza.security.CurrentUser;
import com.taptaza.security.UserPrincipal;
import com.taptaza.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for user profile and address management.
 * All endpoints require authentication.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get the current authenticated user's profile.
     *
     * @param userPrincipal the authenticated user
     * @return the user profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        UserResponse response = userService.getCurrentUser(userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Update the current authenticated user's profile.
     *
     * @param userPrincipal the authenticated user
     * @param request the update request containing new firstName and/or lastName
     * @return the updated user profile
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all addresses for the current authenticated user.
     *
     * @param userPrincipal the authenticated user
     * @return list of addresses
     */
    @GetMapping("/me/addresses")
    public ResponseEntity<List<AddressResponse>> getAddresses(@CurrentUser UserPrincipal userPrincipal) {
        List<AddressResponse> addresses = userService.getAddresses(userPrincipal.getId());
        return ResponseEntity.ok(addresses);
    }

    /**
     * Create a new address for the current authenticated user.
     *
     * @param userPrincipal the authenticated user
     * @param request the create address request
     * @return the created address
     */
    @PostMapping("/me/addresses")
    public ResponseEntity<AddressResponse> createAddress(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody CreateAddressRequest request) {
        AddressResponse response = userService.createAddress(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update an existing address for the current authenticated user.
     *
     * @param userPrincipal the authenticated user
     * @param addressId the address ID to update
     * @param request the update address request
     * @return the updated address
     */
    @PutMapping("/me/addresses/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @CurrentUser UserPrincipal userPrincipal,
            @PathVariable("id") UUID addressId,
            @Valid @RequestBody UpdateAddressRequest request) {
        AddressResponse response = userService.updateAddress(userPrincipal.getId(), addressId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an address for the current authenticated user.
     *
     * @param userPrincipal the authenticated user
     * @param addressId the address ID to delete
     * @return no content
     */
    @DeleteMapping("/me/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(
            @CurrentUser UserPrincipal userPrincipal,
            @PathVariable("id") UUID addressId) {
        userService.deleteAddress(userPrincipal.getId(), addressId);
        return ResponseEntity.noContent().build();
    }
}
