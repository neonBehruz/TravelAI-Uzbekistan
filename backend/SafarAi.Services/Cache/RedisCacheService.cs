using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using SafarAi.Core.Interfaces;

namespace SafarAi.Services.Cache;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisCacheService> _logger;
    private static readonly HashSet<string> _trackedKeys = new();

    public RedisCacheService(IDistributedCache cache, ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var data = await _cache.GetStringAsync(key);
            if (string.IsNullOrEmpty(data)) return default;

            return JsonSerializer.Deserialize<T>(data);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cache read error for key {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(15)
            };

            var json = JsonSerializer.Serialize(value);
            await _cache.SetStringAsync(key, json, options);

            lock (_trackedKeys)
            {
                _trackedKeys.Add(key);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cache write error for key {Key}", key);
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _cache.RemoveAsync(key);
            lock (_trackedKeys)
            {
                _trackedKeys.Remove(key);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cache remove error for key {Key}", key);
        }
    }

    public async Task RemoveByPrefixAsync(string prefix)
    {
        try
        {
            List<string> keysToRemove;
            lock (_trackedKeys)
            {
                keysToRemove = _trackedKeys.Where(k => k.StartsWith(prefix)).ToList();
            }

            foreach (var k in keysToRemove)
            {
                await RemoveAsync(k);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Cache prefix remove error for prefix {Prefix}", prefix);
        }
    }
}
