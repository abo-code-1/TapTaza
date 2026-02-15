package com.taptaza.service;

import com.taptaza.dto.request.CreateAddressRequest;
import com.taptaza.dto.request.UpdateAddressRequest;
import com.taptaza.dto.request.UpdateUserRequest;
import com.taptaza.dto.response.AddressResponse;
import com.taptaza.dto.response.UserResponse;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for user and address management operations.
 */
public interface UserService {

    /**
     * Get user by ID.
     *
     * @param userId the user ID
     * @return the user response DTO
     */
    UserResponse getCurrentUser(UUID userId);

    /**
     * Update user profile (firstName, lastName).
     *
     * @param userId the user ID
     * @param request the update request containing new values
     * @return the updated user response DTO
     */
    UserResponse updateUser(UUID userId, UpdateUserRequest request);

    /**
     * Get all addresses for a user.
     *
     * @param userId the user ID
     * @return list of address response DTOs
     */
    List<AddressResponse> getAddresses(UUID userId);

    /**
     * Create a new address for a user.
     *
     * @param userId the user ID
     * @param request the create address request
     * @return the created address response DTO
     */
    AddressResponse createAddress(UUID userId, CreateAddressRequest request);

    /**
     * Update an existing address for a user.
     *
     * @param userId the user ID
     * @param addressId the address ID
     * @param request the update address request
     * @return the updated address response DTO
     */
    AddressResponse updateAddress(UUID userId, UUID addressId, UpdateAddressRequest request);

    /**
     * Delete an address for a user.
     *
     * @param userId the user ID
     * @param addressId the address ID
     */
    void deleteAddress(UUID userId, UUID addressId);
}
