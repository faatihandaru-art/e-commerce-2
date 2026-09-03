<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'brand_id',
        'name',
        'slug',
        'type',
        'status',
        'short_description',
        'description',
        'meta_title',
        'meta_description',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ProductOption::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function inventories(): HasManyThrough
    {
        return $this->hasManyThrough(
            Inventory::class,
            ProductVariant::class,
            'product_id',
            'product_variant_id'
        );
    }

    /**
     * Total stok fisik gabungan seluruh varian produk dari seluruh gudang.
     */
    public function totalStock(): int
    {
        if ($this->relationLoaded('variants')) {
            return (int) $this->variants->sum(fn (ProductVariant $v) => $v->totalStock());
        }

        return (int) $this->inventories()->sum('quantity_on_hand');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function mainImage()
    {
        return $this->images()->where('is_primary', true)->first() ?? $this->images()->first();
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }
}
