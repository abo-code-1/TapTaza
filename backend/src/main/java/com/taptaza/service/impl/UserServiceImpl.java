package com.taptaza.service.impl;

import com.taptaza.dto.request.CreateAddressRequest;
import com.taptaza.dto.request.UpdateAddressRequest;
import com.taptaza.dto.request.UpdateUserRequest;
import com.taptaza.dto.response.AddressResponse;
import com.taptaza.dto.response.UserResponse;
import com.taptaza.exception.ResourceNotFoundException;
import com.taptaza.model.Address;
import com.taptaza.model.User;
import com.taptaza.repository.AddressRepository;
import com.taptaza.repository.UserRepository;
import com.taptaza.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public UserServiceImpl(UserRepository userRepository, AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        User user = findUserById(userId);
        return UserResponse.fromUser(user);
    }

    @Override
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = findUserById(userId);

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(UUID userId) {
        // Verify user exists
        findUserById(userId);

        return addressRepository.findByUserIdOrderByIsDefaultDescLabelAsc(userId)
                .stream()
                .map(AddressResponse::fromAddress)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse createAddress(UUID userId, CreateAddressRequest request) {
        User user = findUserById(userId);

        // If this address should be default, clear other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultForUser(userId);
        }

        Address address = Address.builder()
                .user(user)
                .label(request.getLabel())
                .street(request.getStreet())
                .apartment(request.getApartment())
                .city(request.getCity())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        Address savedAddress = addressRepository.save(address);
        return AddressResponse.fromAddress(savedAddress);
    }

    @Override
    public AddressResponse updateAddress(UUID userId, UUID addressId, UpdateAddressRequest request) {
        // Verify user exists
        findUserById(userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        // If this address should become default, clear other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultForUser(userId);
        }

        if (request.getLabel() != null) {
            address.setLabel(request.getLabel());
        }
        if (request.getStreet() != null) {
            address.setStreet(request.getStreet());
        }
        if (request.getApartment() != null) {
            address.setApartment(request.getApartment());
        }
        if (request.getCity() != null) {
            address.setCity(request.getCity());
        }
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }

        Address updatedAddress = addressRepository.save(address);
        return AddressResponse.fromAddress(updatedAddress);
    }

    @Override
    public void deleteAddress(UUID userId, UUID addressId) {
        // Verify user exists
        findUserById(userId);

        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        addressRepository.delete(address);
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
