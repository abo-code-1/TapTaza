package com.taptaza.service.impl;

import com.taptaza.dto.request.CreateBookingRequest;
import com.taptaza.dto.response.*;
import com.taptaza.exception.BadRequestException;
import com.taptaza.exception.ResourceNotFoundException;
import com.taptaza.model.*;
import com.taptaza.model.enums.BookingStatus;
import com.taptaza.repository.*;
import com.taptaza.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final BigDecimal ECO_FRIENDLY_SURCHARGE = new BigDecimal("10000");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ServiceRepository serviceRepository;
    private final AddressRepository addressRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                               UserRepository userRepository,
                               CompanyRepository companyRepository,
                               ServiceRepository serviceRepository,
                               AddressRepository addressRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.serviceRepository = serviceRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public BookingResponse createBooking(UUID userId, CreateBookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));

        com.taptaza.model.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", request.getServiceId()));

        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getAddressId()));

        if (!service.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("Service does not belong to the specified company");
        }

        BigDecimal totalPrice = calculateTotalPrice(service.getPrice(), request.getEcoFriendly());

        LocalTime bookingTime = LocalTime.parse(request.getTime(), TIME_FORMATTER);

        Booking booking = Booking.builder()
                .user(user)
                .company(company)
                .service(service)
                .address(address)
                .date(request.getDate())
                .time(bookingTime)
                .status(BookingStatus.PENDING)
                .roomCount(request.getRoomCount() != null ? request.getRoomCount() : 1)
                .hasPets(request.getHasPets() != null ? request.getHasPets() : false)
                .ecoFriendly(request.getEcoFriendly() != null ? request.getEcoFriendly() : false)
                .notes(request.getNotes())
                .totalPrice(totalPrice)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingListResponse> getUserBookings(UUID userId, Pageable pageable) {
        Page<Booking> bookingsPage = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<BookingListResponse> bookingListResponses = bookingsPage.getContent().stream()
                .map(this::mapToBookingListResponse)
                .collect(Collectors.toList());

        return PageResponse.of(
                bookingListResponses,
                bookingsPage.getNumber(),
                bookingsPage.getSize(),
                bookingsPage.getTotalElements()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(UUID userId, UUID bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        return mapToBookingResponse(booking);
    }

    @Override
    public BookingResponse cancelBooking(UUID userId, UUID bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!canBeCancelled(booking.getStatus())) {
            throw new BadRequestException(
                    String.format("Cannot cancel booking with status: %s. Only PENDING or CONFIRMED bookings can be cancelled.",
                            booking.getStatus()),
                    "CANCELLATION_NOT_ALLOWED"
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(updatedBooking);
    }

    private BigDecimal calculateTotalPrice(BigDecimal servicePrice, Boolean ecoFriendly) {
        BigDecimal total = servicePrice;
        if (Boolean.TRUE.equals(ecoFriendly)) {
            total = total.add(ECO_FRIENDLY_SURCHARGE);
        }
        return total;
    }

    private boolean canBeCancelled(BookingStatus status) {
        return status == BookingStatus.PENDING || status == BookingStatus.CONFIRMED;
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setStatus(booking.getStatus());
        response.setDate(booking.getDate());
        response.setTime(booking.getTime().format(TIME_FORMATTER));
        response.setRoomCount(booking.getRoomCount());
        response.setHasPets(booking.getHasPets());
        response.setEcoFriendly(booking.getEcoFriendly());
        response.setNotes(booking.getNotes());
        response.setTotalPrice(booking.getTotalPrice());
        response.setCreatedAt(booking.getCreatedAt());
        response.setCompany(mapToCompanyResponse(booking.getCompany()));
        response.setService(mapToServiceResponse(booking.getService()));
        response.setAddress(mapToAddressResponse(booking.getAddress()));
        return response;
    }

    private BookingListResponse mapToBookingListResponse(Booking booking) {
        BookingListResponse response = new BookingListResponse();
        response.setId(booking.getId());
        response.setStatus(booking.getStatus());
        response.setDate(booking.getDate());
        response.setTime(booking.getTime().format(TIME_FORMATTER));
        response.setTotalPrice(booking.getTotalPrice());
        response.setCreatedAt(booking.getCreatedAt());
        response.setCompanyName(booking.getCompany().getName());
        response.setCompanyLogoUrl(booking.getCompany().getLogoUrl());
        response.setServiceName(booking.getService().getName());
        response.setAddressStreet(booking.getAddress().getStreet());
        return response;
    }

    private CompanyResponse mapToCompanyResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getDescription(),
                company.getRating(),
                company.getReviewCount(),
                company.getPriceRange(),
                company.getVerified(),
                company.getLogoUrl()
        );
    }

    private ServiceResponse mapToServiceResponse(com.taptaza.model.Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDurationMinutes()
        );
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLabel(),
                address.getStreet(),
                address.getApartment(),
                address.getCity(),
                address.getIsDefault()
        );
    }
}
