<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageH extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_code',
        'agency_id',
        'customer_id',
        'package_name',
        'description',
        'is_custom',
        'custom_status',
        'promo_code',
        'package_price',
        'is_active',
        'qty'
    ];

    protected $primaryKey = 'package_h_id';

    #region Getter Setter
    public function getPackageHIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHIdAttribute($value)
    {
        $this->attributes['package_h_id'] = $value;
    }

    public function getPackageCodeAttribute($value)
    {
        return $value;
    }

    public function setPackageCodeAttribute($value)
    {
        $this->attributes['package_code'] = $value;
    }

    public function getAgencyIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyIdAttribute($value)
    {
        $this->attributes['agency_id'] = $value;
    }

    public function getCustomerIdAttribute($value)
    {
        return $value;
    }

    public function setCustomerIdAttribute($value)
    {
        $this->attributes['customer_id'] = $value;
    }

    public function getPackageNameAttribute($value)
    {
        return $value;
    }

    public function setPackageNameAttribute($value)
    {
        $this->attributes['package_name'] = $value;
    }

    public function getDescriptionAttribute($value)
    {
        return $value;
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = $value;
    }

    public function getIsCustomAttribute($value)
    {
        return $value;
    }

    public function setIsCustomAttribute($value)
    {
        $this->attributes['is_custom'] = $value;
    }

    public function getCustomStatusAttribute($value)
    {
        return $value;
    }

    public function setCustomStatusAttribute($value)
    {
        $this->attributes['custom_status'] = $value;
    }

    public function getPromoCodeAttribute($value)
    {
        return $value;
    }

    public function setPromoCodeAttribute($value)
    {
        $this->attributes['promo_code'] = $value;
    }

    public function getPackagePriceAttribute($value)
    {
        return $value;
    }

    public function setPackagePriceAttribute($value)
    {
        $this->attributes['package_price'] = $value;
    }

    public function getIsActiveAttribute($value)
    {
        return $value;
    }

    public function setIsActiveAttribute($value)
    {
        $this->attributes['is_active'] = $value;
    }

    public function getQtyAttribute($value)
    {
        return $value;
    }

    public function setQtyAttribute($value)
    {
        $this->attributes['qty'] = $value;
    }

    public function getTotalDaysAttribute($value)
    {
        return $value;
    }

    public function setTotalDaysAttribute($value)
    {
        $this->attributes['total_days'] = $value;
    }
    #endregion

    #region Relations
    public function packageDs(){
        return $this->hasMany(PackageD::class, 'package_h_id');
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function agency(){
        return $this->belongsTo(Agency::class);
    }

    public function orderDs(){
        return $this->hasMany(OrderD::class);
    }
    #endregion
}
