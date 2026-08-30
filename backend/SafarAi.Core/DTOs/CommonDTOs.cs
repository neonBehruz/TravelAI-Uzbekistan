namespace SafarAi.Core.DTOs;

public record PagedResult<T>(
    List<T> Items,
    int PageNumber,
    int PageSize,
    int TotalCount,
    int TotalPages,
    bool HasPreviousPage,
    bool HasNextPage
)
{
    public static PagedResult<T> Create(List<T> items, int pageNumber, int pageSize, int totalCount)
    {
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        if (totalPages == 0 && totalCount > 0) totalPages = 1;
        return new PagedResult<T>(
            items,
            pageNumber,
            pageSize,
            totalCount,
            totalPages,
            pageNumber > 1,
            pageNumber < totalPages
        );
    }
}

public record PaginationQuery(
    int PageNumber = 1,
    int PageSize = 10
);

public record FileUploadResponseDto(
    string Url,
    string FileName,
    long FileSize,
    string ContentType,
    DateTime UploadedAt
);

public record LiveTouristSignalDto(
    int ActiveTouristsCount,
    string City,
    string Action,
    DateTime Timestamp
);
