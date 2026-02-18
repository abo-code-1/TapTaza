package com.taptaza.controller;

import com.taptaza.dto.request.CreateBookingRequest;
import com.taptaza.dto.response.BookingListResponse;
import com.taptaza.dto.response.BookingResponse;
import com.taptaza.dto.response.PageResponse;
import com.taptaza.security.CurrentUser;
import com.taptaza.security.UserPrincipal;
import com.taptaza.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new booking for the authenticated user.
     *
     * @param userPrincipal the authenticated user
     * @param request       the booking creation request
     * @return the created booking with HTTP 201 status
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody CreateBookingRequest request) {

        BookingResponse response = bookingService.createBooking(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get paginated list of bookings for the authenticated user.
     *
     * @param userPrincipal the authenticated user
     * @param page          page number (0-based, default 0)
     * @param size          page size (default 10)
     * @return paginated list of bookings
     */
    @GetMapping
    public ResponseEntity<PageResponse<BookingListResponse>> getUserBookings(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 100));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<BookingListResponse> response = bookingService.getUserBookings(
                userPrincipal.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Get details of a specific booking.
     *
     * @param userPrincipal the authenticated user
     * @param id            the booking ID
     * @return the booking details
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(
            @CurrentUser UserPrincipal userPrincipal,
            @PathVariable UUID id) {

        BookingResponse response = bookingService.getBookingById(userPrincipal.getId(), id);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel a booking.
     * Only bookings with PENDING or CONFIRMED status can be cancelled.
     *
     * @param userPrincipal the authenticated user
     * @param id            the booking ID to cancel
     * @return the updated booking with CANCELLED status
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @CurrentUser UserPrincipal userPrincipal,
            @PathVariable UUID id) {

        BookingResponse response = bookingService.cancelBooking(userPrincipal.getId(), id);
        return ResponseEntity.ok(response);
    }
}
