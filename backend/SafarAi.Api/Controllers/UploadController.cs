using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafarAi.Core.DTOs;
using SafarAi.Core.Interfaces;

namespace SafarAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IStorageService _storageService;
    private readonly ILogger<UploadController> _logger;

    private static readonly HashSet<string> AllowedImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".svg"
    };

    public UploadController(IStorageService storageService, ILogger<UploadController> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    [HttpPost("image")]
    public async Task<ActionResult<FileUploadResponseDto>> UploadImage(IFormFile? file, [FromQuery] string folder = "places")
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file provided for upload." });
        }

        // Limit file size to 15MB
        if (file.Length > 15 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds the 15MB maximum allowed limit." });
        }

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(ext) || !AllowedImageExtensions.Contains(ext))
        {
            return BadRequest(new { message = $"Unsupported file format. Allowed extensions: {string.Join(", ", AllowedImageExtensions)}" });
        }

        using var stream = file.OpenReadStream();
        var url = await _storageService.UploadFileAsync(stream, file.FileName, file.ContentType, folder);

        return Ok(new FileUploadResponseDto(
            Url: url,
            FileName: file.FileName,
            FileSize: file.Length,
            ContentType: file.ContentType,
            UploadedAt: DateTime.UtcNow
        ));
    }

    [Authorize]
    [HttpPost("avatar")]
    public async Task<ActionResult<FileUploadResponseDto>> UploadAvatar(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No avatar image provided." });
        }

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(ext) || !AllowedImageExtensions.Contains(ext))
        {
            return BadRequest(new { message = "Unsupported avatar image format." });
        }

        using var stream = file.OpenReadStream();
        var url = await _storageService.UploadFileAsync(stream, file.FileName, file.ContentType, "avatars");

        return Ok(new FileUploadResponseDto(
            Url: url,
            FileName: file.FileName,
            FileSize: file.Length,
            ContentType: file.ContentType,
            UploadedAt: DateTime.UtcNow
        ));
    }
}
