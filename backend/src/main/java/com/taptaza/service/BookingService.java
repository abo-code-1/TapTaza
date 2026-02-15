package com.taptaza.service;

import com.taptaza.dto.request.CreateBookingRequest;
import com.taptaza.dto.response.BookingListResponse;
import com.taptaza.dto.response.BookingResponse;
import com.taptaza.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BookingService {

    /**
     * Create a new booking for the authenticated user.
     *
     * @param userId  the ID of the authenticated user
     * @param request the booking creation request containing company, service, address,
     *                date, time, and additional options
     * @return the created booking response with full details
     */
    BookingResponse createBooking(UUID userId, CreateBookingRequest request);

    /**
     * Get paginated list of bookings for the authenticated user.
     *
     * @param userId   the ID of the authenticated user
     * @param pageable pagination parameters (page number, size, sorting)
     * @return paginated response containing simplified booking list items
     */
    PageResponse<BookingListResponse> getUserBookings(UUID userId, Pageable pageable);

    /**
     * Get detailed information about a specific booking.
     *
     * @param userId    the ID of the authenticated user
     * @param bookingId the ID of the booking to retrieve
     * @return the booking response with full details
     * @throws com.taptaza.exception.ResourceNotFoundException if booking not found or doesn't belong to user
     */
    BookingResponse getBookingById(UUID userId, UUID bookingId);

    /**
     * Cancel a booking for the authenticated user.
     * Only bookings with PENDING or CONFIRMED status can be cancelled.
     *
     * @param userId    the ID of the authenticated user
     * @param bookingId the ID of the booking to cancel
     * @return the updated booking response with CANCELLED status
     * @throws com.taptaza.exception.ResourceNotFoundException if booking not found or doesn't belong to user
     * @throws com.taptaza.exception.BadRequestException       if booking cannot be cancelled
     */
    BookingResponse cancelBooking(UUID userId, UUID bookingId);
}
